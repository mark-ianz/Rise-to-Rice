# Data Model

This file summarizes the domain model inferred from SQL queries, TypeScript types, and Zod schemas in the current backend code.

## Identity And Access

### `user`

Represents personal profile information.

Observed fields from types and validators:
- `user_id`
- `first_name`
- `middle_name`
- `last_name`
- `suffix`
- `gender`
- `address`
- `contact_number`
- `birthdate`
- `createdAt`

### `account`

Represents login credentials and account linkage.

Observed fields:
- `account_id`
- `user_id`
- `email`
- `password`

### `role`

Allowed role names in current code:
- `user`
- `admin`
- `super_admin`

### `user_role`

Join table mapping a user to a role.

### `refresh_token`

Stores active refresh tokens in the database.

Observed behavior:
- new refresh token rows are inserted on login
- refresh token expiry is checked against `expired_at`
- the backend rotates refresh tokens when refreshing a session

### `email_verification_code`

Used during verification code request and verification flows.

## Recycling And Points

### `material_category`

Top-level material grouping.

Examples shown in frontend constants:
- Paper
- Plastics
- Precious Metal
- Metal
- Bottle/Glass

### `material`

Represents a recyclable material with a points exchange rate.

Observed fields and rules:
- `material_id`
- `material`
- `category_id`
- `points_per_kg`
- `points_per_kg` must be positive

### `exchange_log`

Represents a logged exchange event.

Observed fields from code:
- `user_id`
- `logged_by`
- `material_id`
- `weight`
- `points_added`

Behavior:
- created by admins
- adds points to the target user during the same flow

### `points`

Stores a user's accumulated points.

Observed field:
- `points_accumulated`

Behavior:
- users can read their own points
- admins can read another user's points
- point manipulation supports `add` and `deduct`

### `action_log`

Audit trail for admin or operational actions.

Observed call sites record actions such as:
- announcement create, update, delete
- points changes
- exchange logging

## Rewards

### `reward`

Represents a redeemable item.

Observed fields:
- `reward_id`
- `reward_name`
- `unit`

Allowed units:
- `pc`
- `g`
- `kg`
- `ml`
- `l`
- `lb`
- `oz`
- `cm`
- `in`
- `m`
- `ft`

### `reward_variation`

Represents a variation of a reward.

Observed fields and rules:
- `variation_id`
- `reward_id`
- `quantity`
- `points_cost`
- `quantity` must be positive
- `points_cost` must be positive

Relationship:
- one reward can have many variations

### `redeem_request`

Represents a user's request to redeem points for a reward variation.

Observed statuses:
- `pending`
- `for pick up`
- `completed`
- `rejected`
- `cancelled`

Observed creation inputs:
- `user_id`
- `variation_id`
- `points_cost`

## Content And Engagement

### `announcement`

Represents a post shown in the public announcement feed.

Observed fields:
- `announcement_id`
- `title`
- `description`
- `image_url`
- `author_id`
- `createdAt`

Rules:
- title is required
- description is optional
- image upload is optional

### `announcement_edit_history`

Stores previous announcement content when announcement-related actions are logged.

### `reactions`

Represents user reactions on announcements.

Relationship:
- belongs to a user
- belongs to an announcement

## Contact And Support

### `contact`

Represents a message submitted through the contact form.

Observed fields:
- `contact_id`
- `first_name`
- `last_name`
- `email`
- `message`
- `status`
- `submittedAt`
- `updatedAt`

Observed statuses:
- `pending`
- `responded`
- `resolved`

## Cross-Entity Relationships

- `account.user_id -> user.user_id`
- `user_role.user_id -> user.user_id`
- `user_role.role_id -> role.role_id`
- `points.user_id -> user.user_id`
- `exchange_log.user_id -> user.user_id`
- `exchange_log.logged_by -> user.user_id`
- `exchange_log.material_id -> material.material_id`
- `material.category_id -> material_category.category_id`
- `reward_variation.reward_id -> reward.reward_id`
- `redeem_request.user_id -> user.user_id`
- `announcement.author_id -> user.user_id`
- `reactions.announcement_id -> announcement.announcement_id`

## Validation Rules Visible In Code

- password minimum length is environment-driven
- contact number length is environment-driven
- contact numbers must contain digits only
- name fields only allow letters and spaces
- reward names cannot be empty
- material points per kg must be positive
- point manipulation amount must be positive

## Source Caveat

The repository does not currently include migrations or a canonical SQL schema file, so this data model is inferred from application code rather than generated from database metadata.
