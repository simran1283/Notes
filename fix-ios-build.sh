#!/bin/bash

# Script to fix iOS build issues with React Native codegen
# This script cleans and rebuilds the iOS project

set -e  # Exit on error

echo "🔧 Fixing iOS Build Issues..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean Xcode derived data
echo -e "${YELLOW}📝 Step 1: Cleaning Xcode Derived Data...${NC}"
rm -rf ~/Library/Developer/Xcode/DerivedData/Notes-* 2>/dev/null || true
echo -e "${GREEN}✓${NC} Derived data cleaned"

# Step 2: Clean iOS build folder
echo ""
echo -e "${YELLOW}📝 Step 2: Cleaning iOS build folder...${NC}"
cd "$(dirname "$0")/ios" || exit 1
rm -rf build 2>/dev/null || true
echo -e "${GREEN}✓${NC} Build folder cleaned"

# Step 3: Remove Pods and Podfile.lock
echo ""
echo -e "${YELLOW}📝 Step 3: Removing old Pods...${NC}"
rm -rf Pods Podfile.lock 2>/dev/null || true
echo -e "${GREEN}✓${NC} Old Pods removed"

# Step 4: Reinstall pods
echo ""
echo -e "${YELLOW}📝 Step 4: Reinstalling CocoaPods...${NC}"
if command -v pod &> /dev/null; then
    pod install
elif command -v bundle &> /dev/null && [ -f "Gemfile" ]; then
    cd .. && bundle install && cd ios
    bundle exec pod install
else
    echo -e "${RED}❌ Error: CocoaPods not found. Please install CocoaPods first.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Done! Now try building in Xcode.${NC}"
echo ""
echo "If you still see linker errors, try:"
echo "  1. In Xcode: Product → Clean Build Folder (Shift+Cmd+K)"
echo "  2. Close and reopen Xcode"
echo "  3. Build again"

