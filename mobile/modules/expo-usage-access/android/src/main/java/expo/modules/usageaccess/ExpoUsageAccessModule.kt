package expo.modules.usageaccess

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.app.usage.UsageStats
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class UsageStatRecord : Record {
    @Field val packageName: String = ""
    @Field val appName: String = ""
    @Field val totalTimeInForeground: Long = 0
    @Field val lastTimeUsed: Long = 0
}

class ExpoUsageAccessModule : Module() {
    private val context: Context
        get() = appContext.reactContext ?: throw Exception("React context is null")

    override fun definition() = ModuleDefinition {
        Name("ExpoUsageAccess")

        AsyncFunction("checkUsageAccessPermission") {
            return@AsyncFunction checkUsageAccess()
        }

        AsyncFunction("openUsageAccessSettings") {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        }

        AsyncFunction("getUsageStats") { startTime: Long, endTime: Long ->
            val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val stats: List<UsageStats> = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime)

            stats.filter { it.totalTimeInForeground > 0 }.map { stat ->
                mapOf(
                    "packageName" to stat.packageName,
                    "appName" to getAppName(stat.packageName),
                    "totalTimeInForeground" to stat.totalTimeInForeground,
                    "lastTimeUsed" to stat.lastTimeUsed
                )
            }
        }

        AsyncFunction("getInstalledApps") {
            val pm = context.packageManager
            val packages = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                pm.getInstalledApplications(PackageManager.ApplicationInfoFlags.of(0))
            } else {
                @Suppress("DEPRECATION")
                pm.getInstalledApplications(0)
            }
            packages.map { appInfo ->
                mapOf(
                    "packageName" to appInfo.packageName,
                    "name" to pm.getApplicationLabel(appInfo).toString(),
                    "version" to getAppVersion(appInfo.packageName),
                    "isSystemApp" to ((appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0)
                )
            }
        }
    }

    private fun checkUsageAccess(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(),
                context.packageName
            )
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                android.os.Process.myUid(),
                context.packageName
            )
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    private fun getAppName(packageName: String): String {
        return try {
            val pm = context.packageManager
            val info = pm.getApplicationInfo(packageName, 0)
            pm.getApplicationLabel(info).toString()
        } catch (e: Exception) {
            packageName
        }
    }

    private fun getAppVersion(packageName: String): String {
        return try {
            val pm = context.packageManager
            val info = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                pm.getPackageInfo(packageName, PackageManager.PackageInfoFlags.of(0))
            } else {
                @Suppress("DEPRECATION")
                pm.getPackageInfo(packageName, 0)
            }
            info.versionName ?: ""
        } catch (e: Exception) {
            ""
        }
    }
}
