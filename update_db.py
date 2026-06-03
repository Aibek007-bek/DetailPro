
"""
Script to add missing photo columns to the orders table.
Usage: python update_db.py
"""

import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parent / "detailing_crm.db"


def add_photo_columns():
    """Add missing photo columns to the orders table."""
    if not DATABASE_PATH.exists():
        print(f"❌ Database not found at {DATABASE_PATH}")
        return False

    try:
        conn = sqlite3.connect(str(DATABASE_PATH))
        cursor = conn.cursor()

        cursor.execute("PRAGMA table_info(orders)")
        columns = [row[1] for row in cursor.fetchall()]

        if "photo_before" in columns and "photo_after" in columns and "image_url" in columns:
            print("✅ Columns photo_before, photo_after and image_url already exist.")
        else:
            if "photo_before" not in columns:
                print("Adding column photo_before...")
                cursor.execute("ALTER TABLE orders ADD COLUMN photo_before VARCHAR(255)")
                print("✅ Added photo_before column")

            if "photo_after" not in columns:
                print("Adding column photo_after...")
                cursor.execute("ALTER TABLE orders ADD COLUMN photo_after VARCHAR(255)")
                print("✅ Added photo_after column")

            if "image_url" not in columns:
                print("Adding column image_url...")
                cursor.execute("ALTER TABLE orders ADD COLUMN image_url VARCHAR(255)")
                print("✅ Added image_url column")

       
        cursor.execute("PRAGMA table_info(users)")
        user_columns = [row[1] for row in cursor.fetchall()]
        if "phone" not in user_columns:
            print("Adding column phone to users...")
            cursor.execute("ALTER TABLE users ADD COLUMN phone VARCHAR(30)")
            print("✅ Added phone column to users")
        else:
            print("✅ Column phone already exists in users.")

        
        cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'")
        user_sql = cursor.fetchone()
        if user_sql and "role IN ('admin', 'worker', 'master')" not in user_sql[0]:
            print("Updating users role constraint to include master...")
            cursor.execute("PRAGMA foreign_keys=OFF")
            cursor.execute("ALTER TABLE users RENAME TO users_old")
            cursor.execute(
                "CREATE TABLE users ("
                "id INTEGER NOT NULL, "
                "username VARCHAR(80) NOT NULL UNIQUE, "
                "password_hash VARCHAR(256) NOT NULL, "
                "role VARCHAR(20) NOT NULL, "
                "phone VARCHAR(30), "
                "PRIMARY KEY (id), "
                "CONSTRAINT ck_users_role CHECK (role IN ('admin', 'worker', 'master'))"
                ")"
            )
            cursor.execute(
                "INSERT INTO users (id, username, password_hash, role, phone) "
                "SELECT id, username, password_hash, role, phone FROM users_old"
            )
            cursor.execute("DROP TABLE users_old")
            cursor.execute("PRAGMA foreign_keys=ON")
            print("✅ Updated users role constraint")
        else:
            print("✅ Users role constraint already allows master.")

        conn.commit()
        conn.close()
        print("\n🎉 Database schema updated successfully!")
        return True

    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


if __name__ == "__main__":
    success = add_photo_columns()
    exit(0 if success else 1)
