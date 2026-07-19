<!DOCTYPE html>
<html lang="fr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Invitation Safekid</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    * { box-sizing: border-box; }
    body, html { margin: 0; padding: 0; width: 100%; }
    body { background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    img { border: 0; display: block; max-width: 100%; }
    a { color: #2a3eef; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .wrapper { width: 100% !important; padding: 0 !important; }
      .body    { padding: 32px 24px !important; }
      .footer  { padding: 20px 24px !important; }
      .btn     { display: block !important; text-align: center !important; width: 100% !important; }
    }
  </style>
</head>
<body>

<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; min-height:100vh;">
  <tr>
    <td align="center" style="padding: 48px 16px;">

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;" class="wrapper">
        <tr>
          <td>

            {{-- Logo --}}
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding-bottom: 32px;">
                  <img
                    src="{{ config('app.url') }}/images/safekid-logo.png"
                    alt="Safekid"
                    width="140"
                    style="height:auto; display:block;"
                  />
                </td>
              </tr>
            </table>

            {{-- Card --}}
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
                   style="background:#ffffff; border-radius:16px; border:1px solid #e8ecf4; overflow:hidden;">

              {{-- Blue header band --}}
              <tr>
                <td style="background-color:#2a3eef; height:6px; font-size:0; line-height:0;">&nbsp;</td>
              </tr>

              {{-- Body --}}
              <tr>
                <td align="center" style="padding: 40px 48px 36px;" class="body">

                  {{-- Title --}}
                  <h1 style="margin:0 0 8px; font-size:20px; font-weight:700; color:#0f172a; line-height:1.3; text-align:center;">
                    @if(!empty($isNewUser))
                      Vous êtes invité à rejoindre une famille
                    @else
                      Vous avez rejoint une famille
                    @endif
                  </h1>

                  {{-- Subtitle --}}
                  @if(!empty($recipientName))
                  <p style="margin:0 0 28px; font-size:14px; color:#64748b; line-height:1.6; text-align:center;">
                    Bonjour {{ $recipientName }},
                  </p>
                  @else
                  <p style="margin:0 0 28px; font-size:14px; color:#64748b; line-height:1.6; text-align:center;">
                    Vous avez reçu une invitation pour rejoindre une famille sur Safekid.
                  </p>
                  @endif

                  {{-- Info block --}}
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%"
                         style="background:#f0f4ff; border-radius:10px; margin-bottom:28px;">
                    <tr>
                      <td style="padding: 20px 24px;">
                        <p style="margin:0 0 14px; font-size:11px; font-weight:700; color:#2a3eef; text-transform:uppercase; letter-spacing:0.8px; text-align:center;">
                          Détails de l'invitation
                        </p>
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding: 5px 0; text-align:center;">
                              <span style="font-size:13px; color:#94a3b8; font-weight:500;">Famille&nbsp;&nbsp;</span>
                              <span style="font-size:13px; color:#0f172a; font-weight:700;">{{ $familyName }}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 5px 0; text-align:center;">
                              <span style="font-size:13px; color:#94a3b8; font-weight:500;">Rôle&nbsp;&nbsp;</span>
                              <span style="display:inline-block; background:#dbe5ff; color:#2a3eef; font-size:12px; font-weight:600; padding:2px 12px; border-radius:999px;">
                                {{ $roleLabel }}
                              </span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {{-- Role description --}}
                  <p style="margin:0 0 28px; font-size:13px; color:#64748b; line-height:1.7; text-align:center;">
                    {{ $roleDescription }}
                  </p>

                  {{-- CTA --}}
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                    <tr>
                      <td align="center">
                        <a href="{{ $dashboardUrl }}"
                           class="btn"
                           style="display:inline-block; background-color:#2a3eef; color:#ffffff; font-size:15px; font-weight:600; padding:14px 36px; border-radius:8px; text-decoration:none; line-height:1;">
                          @if(!empty($isNewUser)) Créer mon compte et rejoindre @else Accéder au tableau de bord @endif
                        </a>
                      </td>
                    </tr>
                  </table>

                  {{-- Disclaimer --}}
                  <p style="margin:28px 0 0; font-size:12px; color:#94a3b8; line-height:1.6; text-align:center;">
                    Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet e-mail en toute sécurité.
                  </p>

                </td>
              </tr>

              {{-- Divider --}}
              <tr>
                <td style="padding: 0 48px;">
                  <div style="height:1px; background:#f1f5f9;"></div>
                </td>
              </tr>

              {{-- Footer --}}
              <tr>
                <td align="center" style="padding: 20px 48px;" class="footer">
                  <p style="margin:0 0 4px; font-size:12px; color:#94a3b8; text-align:center;">
                    Cet e-mail a été envoyé par <strong style="color:#64748b;">Safekid</strong>, la plateforme de contrôle parental.
                  </p>
                  <p style="margin:0; font-size:11px; color:#cbd5e1; text-align:center;">
                    © {{ date('Y') }} Safekid. Tous droits réservés.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>

</body>
</html>
