#!/usr/bin/env python3
"""
Script to run Supabase migrations manually
"""

import asyncio
import os
from pathlib import Path
from services.supabase_client import get_supabase_client

async def run_migrations():
    """Run all migration files in order"""
    try:
        supabase = get_supabase_client()
        print("Connected to Supabase successfully")
        
        # Get migration files in order
        migrations_dir = Path(__file__).parent / "supabase" / "migrations"
        migration_files = sorted(migrations_dir.glob("*.sql"))
        
        print(f"Found {len(migration_files)} migration files:")
        for migration in migration_files:
            print(f"  - {migration.name}")
        
        for migration_file in migration_files:
            print(f"\n📁 Running migration: {migration_file.name}")
            
            # Read migration SQL
            with open(migration_file, 'r') as f:
                sql_content = f.read()
            
            print(f"📄 SQL Content preview (first 200 chars):")
            print(f"   {sql_content[:200]}...")
            
            try:
                # Execute the SQL - Note: Supabase Python client doesn't support raw SQL
                # We need to use the Supabase SQL editor or run this via psql
                print(f"⚠️  Cannot execute raw SQL via Python client")
                print(f"   Please run this SQL manually in Supabase SQL Editor:")
                print(f"   {migration_file}")
                print()
                
            except Exception as e:
                print(f"❌ Failed to run migration {migration_file.name}: {e}")
                return False
        
        print("✅ Migration script completed!")
        print("\n🔧 Next steps:")
        print("1. Go to your Supabase dashboard")
        print("2. Navigate to SQL Editor")
        print("3. Run each migration file manually in order:")
        for migration in migration_files:
            print(f"   - {migration.name}")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(run_migrations())
    if not success:
        exit(1)