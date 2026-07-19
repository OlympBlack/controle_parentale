<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ContentCategoryResource;
use App\Http\Traits\ApiResponse;
use App\Models\ContentCategory;
use Illuminate\Http\Request;

class ContentCategoryController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $categories = ContentCategory::query()
            ->with('children')
            ->whereNull('parent_category_id')
            ->orderBy('name')
            ->get();

        return $this->success(
            ContentCategoryResource::collection($categories),
            'Liste des catégories de contenu'
        );
    }
}
