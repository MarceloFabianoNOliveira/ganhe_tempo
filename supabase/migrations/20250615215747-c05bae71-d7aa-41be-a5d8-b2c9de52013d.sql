
-- Step 1: Drop the conflicting 'id' column if it already exists AND isn't SERIAL.
-- Since you have already renamed the old id to id_old previously, this step will only work if 'id' wasn't renamed.
-- If the column exists and is not SERIAL, drop it:
ALTER TABLE public.system_users DROP COLUMN IF EXISTS id;

-- Step 2: Add the new SERIAL PRIMARY KEY 'id' column
ALTER TABLE public.system_users ADD COLUMN id SERIAL PRIMARY KEY;

-- Step 3: Ensure that the old 'id_old' column is present (as a backup, do not drop yet)
-- If everything is fine and you want to clean up later, you can DROP COLUMN id_old;

-- If you have any related foreign keys, review them after migration.
