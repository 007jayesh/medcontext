#!/usr/bin/env python3
"""
Setup script for Paypr MVP Backend
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.8+"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version.split()[0]} detected")

def create_virtual_environment():
    """Create virtual environment if it doesn't exist"""
    venv_path = Path("venv")
    
    if venv_path.exists():
        print("✅ Virtual environment already exists")
        return
    
    print("📦 Creating virtual environment...")
    subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
    print("✅ Virtual environment created")

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    
    # Determine the correct pip path
    if os.name == 'nt':  # Windows
        pip_path = Path("venv/Scripts/pip")
    else:  # Unix/Linux/macOS
        pip_path = Path("venv/bin/pip")
    
    subprocess.run([str(pip_path), "install", "-r", "requirements.txt"], check=True)
    print("✅ Dependencies installed")

def setup_environment_file():
    """Setup environment configuration"""
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if env_file.exists():
        print("✅ .env file already exists")
        return
    
    if env_example.exists():
        shutil.copy(env_example, env_file)
        print("📝 .env file created from .env.example")
        print("⚠️  Please edit .env file with your actual configuration values")
    else:
        print("⚠️  .env.example file not found")

def create_upload_directory():
    """Create upload directory for temporary files"""
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)
    print("✅ Upload directory created")

def display_next_steps():
    """Display next steps for user"""
    print("\n" + "="*50)
    print("🎉 Backend setup completed!")
    print("="*50)
    print("\nNext steps:")
    print("1. Edit .env file with your Supabase credentials")
    print("2. Run the database migrations in your Supabase project:")
    print("   - Execute the SQL files in supabase/migrations/ in order")
    print("3. Start the development server:")
    
    if os.name == 'nt':  # Windows
        print("   venv\\Scripts\\python main.py")
    else:  # Unix/Linux/macOS
        print("   source venv/bin/activate")
        print("   python main.py")
    
    print("\n📚 API Documentation will be available at:")
    print("   http://localhost:8000/docs")

def main():
    """Main setup function"""
    print("🚀 Setting up Paypr MVP Backend...")
    print("="*40)
    
    try:
        check_python_version()
        create_virtual_environment()
        install_dependencies()
        setup_environment_file()
        create_upload_directory()
        display_next_steps()
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Setup failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()