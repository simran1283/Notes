#!/bin/bash

# Script to fix Xcode SDK issues for React Native iOS development
# This script switches xcode-select to use full Xcode installation
# and reinstalls CocoaPods dependencies

set -e  # Exit on error

echo "🔧 Fixing Xcode SDK Configuration..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Xcode.app exists
if [ ! -d "/Applications/Xcode.app" ]; then
    echo -e "${RED}❌ Error: Xcode.app not found at /Applications/Xcode.app${NC}"
    echo "Please install Xcode from the App Store first."
    exit 1
fi

echo -e "${GREEN}✓${NC} Xcode.app found"

# Step 1: Switch xcode-select to full Xcode installation
echo ""
echo "📝 Step 1: Switching xcode-select to Xcode.app..."
if sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer; then
    echo -e "${GREEN}✓${NC} Successfully switched to Xcode.app"
else
    echo -e "${RED}❌ Failed to switch xcode-select${NC}"
    echo "You may need to enter your password."
    exit 1
fi

# Step 2: Accept Xcode license
echo ""
echo "📝 Step 2: Accepting Xcode license..."
if sudo xcodebuild -license accept 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Xcode license accepted"
else
    echo -e "${YELLOW}⚠${NC}  License may already be accepted or requires manual acceptance"
fi

# Step 3: Verify SDK is available
echo ""
echo "📝 Step 3: Verifying iOS SDK availability..."
if SDK_PATH=$(xcrun --show-sdk-path --sdk iphoneos 2>/dev/null); then
    echo -e "${GREEN}✓${NC} iOS SDK found at: $SDK_PATH"
else
    echo -e "${RED}❌ iOS SDK still not found${NC}"
    echo "You may need to install additional Xcode components."
    echo "Try opening Xcode.app and installing additional components if prompted."
    exit 1
fi

# Step 4: Clean and reinstall pods
echo ""
echo "📝 Step 4: Cleaning and reinstalling CocoaPods..."
cd "$(dirname "$0")/ios" || exit 1

# Remove old pod files
if [ -d "Pods" ]; then
    echo "Removing old Pods directory..."
    rm -rf Pods
fi

if [ -f "Podfile.lock" ]; then
    echo "Removing Podfile.lock..."
    rm -f Podfile.lock
fi

# Reinstall pods
echo "Installing pods..."
if pod install; then
    echo -e "${GREEN}✓${NC} CocoaPods installed successfully"
else
    echo -e "${RED}❌ Failed to install CocoaPods${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ All done! Your Xcode SDK is now configured correctly.${NC}"
echo "You can now build your iOS app."

