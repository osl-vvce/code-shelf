
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    category VARCHAR(80),
    github_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
