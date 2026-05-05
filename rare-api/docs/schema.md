# Database Schema

```mermaid
erDiagram

    RareUser {
        int id PK
        string username
        string first_name
        string last_name
        string email
        string password
        bool is_staff
        bool is_active
        bool is_superuser
        datetime last_login
        datetime date_joined
        string bio
        string profile_image_url
        date created_on
    }

    Category {
        int id PK
        string label
    }

    Post {
        int id PK
        int user_id FK
        int category_id FK
        string title
        date publication_date
        string image_url
        text content
        bool approved
    }

    Tag {
        int id PK
        string label
    }

    PostTag {
        int id PK
        int post_id FK
        int tag_id FK
    }

    Comment {
        int id PK
        int post_id FK
        int author_id FK
        string subject
        text content
        datetime created_on
    }

    Reaction {
        int id PK
        string label
        string image_url
    }

    PostReaction {
        int id PK
        int user_id FK
        int reaction_id FK
        int post_id FK
    }

    Subscription {
        int id PK
        int follower_id FK
        int author_id FK
        date created_on
        datetime ended_on
    }

    DemotionQueue {
        int id PK
        string action
        int admin_id FK
        int approver_one_id FK
    }

    RareUser ||--o{ Post : "writes"
    Category ||--o{ Post : "categorizes"
    Post ||--o{ PostTag : "tagged via"
    Tag ||--o{ PostTag : "applied via"
    Post ||--o{ Comment : "has"
    RareUser ||--o{ Comment : "authors"
    Post ||--o{ PostReaction : "receives"
    RareUser ||--o{ PostReaction : "gives"
    Reaction ||--o{ PostReaction : "used in"
    RareUser ||--o{ Subscription : "follows (as follower)"
    RareUser ||--o{ Subscription : "followed by (as author)"
    RareUser ||--o{ DemotionQueue : "initiates (as admin)"
    RareUser ||--o{ DemotionQueue : "approves (as approver_one)"
```

## Notes

- `RareUser` extends Django's `AbstractUser`; fields above `bio` are inherited from it.
- `PostTag` is a join table between `Post` and `Tag` (many-to-many).
- `PostReaction` is a three-way join table linking `RareUser`, `Post`, and `Reaction`.
- `Subscription` has two foreign keys to `RareUser`: `follower` (the subscriber) and `author` (the person being followed).
- `DemotionQueue` has two foreign keys to `RareUser`: `admin` (who initiated the demotion) and `approver_one` (who approved it). The combination of `(action, admin, approver_one)` is unique.
- `Subscription.ended_on` is nullable — a `NULL` value means the subscription is still active.
