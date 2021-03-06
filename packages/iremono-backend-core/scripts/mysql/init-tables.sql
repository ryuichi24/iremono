CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS storage_items (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id VARCHAR(36),
    owner_id VARCHAR(36) NOT NULL,
    file_path VARCHAR(255),
    file_size INT,
    mime_type VARCHAR(255),
    file_extension VARCHAR(255),
    is_folder BOOLEAN NOT NULL,
    is_in_trash BOOLEAN NOT NULL DEFAULT FALSE,
    last_viewed_at VARCHAR(255),
    initialization_vector VARCHAR(32),
    is_root_folder BOOLEAN NOT NULL DEFAULT FALSE,
    is_crypto_folder_item BOOLEAN NOT NULL DEFAULT FALSE,
    client_encryption_key_hash VARCHAR(128),
    has_thumbnail BOOLEAN NOT NULL DEFAULT FALSE,
    thumbnail_path VARCHAR(255),
    thumbnail_size INT,
    thumbnail_initialization_vector VARCHAR(32),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk__storage_items__users__owner_id FOREIGN KEY (owner_id) REFERENCES users (id)
);