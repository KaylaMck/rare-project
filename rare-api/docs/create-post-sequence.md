# Create Post — Sequence Diagram

Traces the full flow from the user clicking **Save** on the new-post form in the React client through to the database write on the Django API.

```mermaid
sequenceDiagram
    autonumber

    actor User
    participant PostCreate as PostCreate.js
    participant PostManager as PostManager.js
    participant DRF as DRF Middleware
    participant View as post_views.py
    participant ORM as Django ORM
    participant DB as PostgreSQL

    %% ── User fills form and submits ──────────────────────────────────────────
    User->>PostCreate: clicks Save button
    PostCreate->>PostCreate: handleSave(e) — e.preventDefault()
    Note over PostCreate: reads titleRef, categoryRef, contentRef

    %% ── Frontend HTTP request ────────────────────────────────────────────────
    PostCreate->>PostManager: createPost({title, category_id, content})
    PostManager->>DRF: POST /posts
    Note over PostManager,DRF: Authorization: Token {localStorage.auth_token}<br/>Content-Type: application/json

    %% ── Auth & permission check ──────────────────────────────────────────────
    DRF->>DRF: TokenAuthentication — resolve token to RareUser
    alt token missing or invalid
        DRF-->>PostManager: 401 Unauthorized
        PostManager-->>PostCreate: error response
        PostCreate-->>User: stays on form
    end
    DRF->>DRF: IsAuthenticated.has_permission() — True

    %% ── View: validate category ──────────────────────────────────────────────
    DRF->>View: post_list(request) [POST branch]
    View->>ORM: Category.objects.get(pk=category_id)
    ORM->>DB: SELECT * FROM rareapi_category WHERE id = category_id
    DB-->>ORM: Category row
    ORM-->>View: category object
    alt category not found
        View-->>DRF: 400 "Category not found"
        DRF-->>PostManager: 400 Bad Request
        PostManager-->>PostCreate: error response
        PostCreate-->>User: stays on form
    end

    %% ── View: write new post ─────────────────────────────────────────────────
    View->>ORM: Post.objects.create(user, category, title, content, image_url, publication_date, approved)
    Note over View,ORM: approved = request.user.is_staff (False for regular users, True for admins)
    ORM->>DB: INSERT INTO rareapi_post (user_id, category_id, title, content, image_url, publication_date, approved)
    DB-->>ORM: new Post row (with id)
    ORM-->>View: post object

    %% ── Serialise and respond ────────────────────────────────────────────────
    View->>View: PostDetailSerializer(post).data
    View-->>DRF: Response(data, status=201)
    DRF-->>PostManager: 201 Created — {id, title, content, publication_date, image_url, approved, user, category, tags}
    PostManager-->>PostCreate: post object (JSON)

    %% ── Optional image upload ────────────────────────────────────────────────
    alt user selected an image file
        PostCreate->>PostManager: uploadPostImage(post.id, FormData)
        PostManager->>DRF: PUT /posts/{post.id}/image
        Note over PostManager,DRF: Authorization: Token, multipart/form-data body
        DRF->>View: upload_post_image(request, pk=post.id)
        View->>ORM: Post.objects.get(pk=post.id)
        ORM->>DB: SELECT * FROM rareapi_post WHERE id = post.id
        DB-->>ORM: Post row
        ORM-->>View: post object
        View->>View: assert post.user == request.user
        View->>View: save file to MEDIA_ROOT/post_images/
        View->>ORM: post.image_url = absolute_url — post.save()
        ORM->>DB: UPDATE rareapi_post SET image_url = ... WHERE id = post.id
        DB-->>ORM: updated row
        View-->>DRF: Response({image_url}, status=200)
        DRF-->>PostManager: 200 OK {image_url}
        PostManager-->>PostCreate: image response
    end

    %% ── Navigate to new post ─────────────────────────────────────────────────
    PostCreate->>User: navigate("/posts/{post.id}")
```

## Key notes

| Detail | Value |
|---|---|
| Client entry point | `PostCreate.handleSave()` — `rare-client/src/components/posts/PostCreate.js` |
| API manager | `createPost()` — `rare-client/src/managers/PostManager.js` |
| Auth scheme | DRF `TokenAuthentication`; token stored in `localStorage.auth_token` |
| Create endpoint | `POST /posts` → `post_list()` in `rare-api/rareapi/views/post_views.py` |
| Image endpoint | `PUT /posts/<pk>/image` → `upload_post_image()` in the same file |
| ORM call | `Post.objects.create(...)` — no manual SQL |
| `approved` logic | `True` when `request.user.is_staff`, else `False` (pending moderation) |
| Image upload | Separate `PUT` request after the post is created; `image_url` defaults to `""` |
