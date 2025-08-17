#!/usr/bin/env python3
"""
Development startup script for Paypr MVP Backend
"""

import os
import sys
import subprocess
from pathlib import Path

def check_environment():
    """Check if environment is properly set up"""
    print("🔍 Checking environment...")
    
    # Check if virtual environment exists
    venv_path = Path("venv")
    if not venv_path.exists():
        print("❌ Virtual environment not found. Run setup.py first.")
        return False
    
    # Check if .env file exists
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  .env file not found. Using default configuration.")
        print("   Create .env file from .env.example for production use.")
    
    # Check if uploads directory exists
    uploads_dir = Path("uploads")
    uploads_dir.mkdir(exist_ok=True)
    
    print("✅ Environment check completed")
    return True

def start_server():
    """Start the FastAPI development server"""
    print("🚀 Starting Paypr MVP Backend...")
    
    try:
        # Determine the correct Python path
        if os.name == 'nt':  # Windows
            python_path = Path("venv/Scripts/python")
        else:  # Unix/Linux/macOS
            python_path = Path("venv/bin/python")
        
        # Start the server
        cmd = [str(python_path), "main.py"]
        
        print(f"📡 Running: {' '.join(cmd)}")
        print("📚 API docs will be available at: http://localhost:8000/docs")
        print("🔗 Health check: http://localhost:8000/health")
        print("\n" + "="*50)
        
        subprocess.run(cmd, check=True)
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

def main():
    """Main startup function"""
    print("🌟 Paypr MVP Backend - Development Server")
    print("=" * 40)
    
    if not check_environment():
        print("\n💡 To set up the environment, run:")
        print("   python setup.py")
        sys.exit(1)
    
    start_server()

if __name__ == "__main__":
    main()