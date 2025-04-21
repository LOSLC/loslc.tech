<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Response;
use Inertia\Inertia;
use App\Models\Post;
use App\Models\Category;

class BlogController extends Controller
{

    /**
     * Show lastest 10 Posts 
     * @return Response
     */
    public function index(): Response
    {
        $posts = Post::latest()->with(['tags', 'category', 'author'])
            ->select(['id', 'title', 'slug', 'description', 'image', 'category_id', 'author_id', 'created_at'])
            ->where('status', 'published')->paginate(10);

        $posts->getCollection()->transform(function ($post) {
            $post->category = $post->category();
            $post->likesCount = $post->getLikesCountAttribute();
            $post->commentsCount = $post->getCommentsCountAttribute();
            $post->createdAt = $post->getCreatedAtAttribute($post->created_at);

            return $post;
        });

        return Inertia::render('blog/main', [
            'posts' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'links' => $posts->linkCollection(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }


    /**
     * Show a Post
     * @param string $slug Post slug
     * @param \App\Models\Post $post Post model
     * @return Response 
     */
    public function show(string $slug, Post $post): Response
    {
        $post->status != 'published' && abort(404);

        $post = Post::select(['id', 'title', 'slug', 'description', 'content', 'image', 'views', 'category_id', 'author_id', 'created_at'])
            ->with(['tags', 'category', 'author'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $post->update(['views' => $post->views + 1]);

        $post->isLiked = $post->getIsLikedAttribute();
        $post->likesCount = $post->getLikesCountAttribute();
        $post->commentsCount = $post->getCommentsCountAttribute();
        $post->createdAt = $post->getCreatedAtAttribute($post->created_at);

        $comments = $post->comments()
            ->whereNull('parent_id')
            ->with([
                'author:id,name,avatar_url',
                'replies' => function ($query) {
                    $query->with([
                        'author:id,name,avatar_url',
                        'replies' => function ($subQuery) {
                            $subQuery->with(['author:id,name,avatar_url']);
                        }
                    ]);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        $transformComment = function ($comment) use (&$transformComment) {
            $comment->createdAt = $comment->getDateAttribute($comment->created_at);
            $comment->updatedAt = $comment->getDateAttribute($comment->updated_at);

            if ($comment->replies) {
                $comment->replies->each(function ($reply) use ($transformComment) {
                    $transformComment($reply);
                });
            }

            return $comment;
        };

        $comments->transform(function ($comment) use ($transformComment) {
            return $transformComment($comment);
        });

        return Inertia::render('blog/post/main', [
            'post' => $post,
            'tags' => $post->tags, // Utiliser la relation chargée plutôt que la méthode
            'category' => $post->category,
            'comments' => $comments,
        ]);
    }

    public function comment(string $slug, Post $post, Request $request): RedirectResponse
    {
        $request->validate(['comment' => ['required', 'string', 'max:1500']]);
        Comment::create([
            'author_id' => auth()->user()->id,
            'post_id' => $post->id,
            'content' => $request->comment,
            'parent_id' => $request->parent_id ?? null,
        ]);

        return Redirect::route('blog.show', [$post->slug, $post->id]);
    }

    public function category(string $slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail()->with('posts');
        $posts = $category->posts()->where('status', 'published')->latest()->paginate(10);

        $posts->getCollection()->transform(function ($post) {
            $post->category = $post->category();
            $post->likesCount = $post->getLikesCountAttribute();
            $post->commentsCount = $post->getCommentsCountAttribute();
            $post->createdAt = $post->getCreatedAtAttribute($post->created_at);

            return $post;
        });

        // return Inertia::render('', [
    }
}
