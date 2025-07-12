#!/bin/bash

# 🧪 ReWear Final Validation Script
# Tests all systems for judge demonstration

echo "🚀 ReWear Final Validation Starting..."
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test results
print_test() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((TESTS_FAILED++))
    fi
}

# Function to check if service is running
check_service() {
    local port=$1
    local service=$2
    
    if curl -s "http://localhost:$port" > /dev/null 2>&1; then
        print_test 0 "$service is running on port $port"
        return 0
    else
        print_test 1 "$service is NOT running on port $port"
        return 1
    fi
}

# Function to test API endpoint
test_api() {
    local endpoint=$1
    local description=$2
    local expected_status=${3:-200}
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000$endpoint")
    
    if [ "$response" -eq "$expected_status" ]; then
        print_test 0 "API: $description (HTTP $response)"
        return 0
    else
        print_test 1 "API: $description (Expected $expected_status, got $response)"
        return 1
    fi
}

echo -e "${BLUE}🔍 Phase 1: Service Health Checks${NC}"
echo "=================================="

# Check if MongoDB is running
if pgrep mongod > /dev/null; then
    print_test 0 "MongoDB process is running"
else
    print_test 1 "MongoDB process is NOT running"
fi

# Check backend service
check_service 5000 "Backend API"

# Check frontend service
check_service 3000 "Frontend React App"

echo ""
echo -e "${BLUE}🔗 Phase 2: API Connectivity Tests${NC}"
echo "==================================="

# Test basic API endpoints
test_api "/api/health" "Health check endpoint"
test_api "/api/items" "Items endpoint" 401  # Should require auth
test_api "/api/docs" "Swagger documentation" 200

echo ""
echo -e "${BLUE}🔐 Phase 3: Authentication Tests${NC}"
echo "=================================="

# Test login with seeded admin user
echo "Testing admin login..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@rewear.com","password":"admin123"}')

if echo "$AUTH_RESPONSE" | grep -q "token"; then
    print_test 0 "Admin authentication successful"
    
    # Extract token for further tests
    TOKEN=$(echo "$AUTH_RESPONSE" | sed 's/.*"token":"\([^"]*\)".*/\1/')
    
    # Test authenticated endpoint
    AUTH_TEST=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        http://localhost:5000/api/auth/me)
    
    if echo "$AUTH_TEST" | grep -q "200"; then
        print_test 0 "Authenticated API access works"
    else
        print_test 1 "Authenticated API access failed"
    fi
else
    print_test 1 "Admin authentication failed"
    TOKEN=""
fi

echo ""
echo -e "${BLUE}📦 Phase 4: Database & Seeding Tests${NC}"
echo "======================================"

# Test if seeded data exists
if [ -n "$TOKEN" ]; then
    ITEMS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
        http://localhost:5000/api/items)
    
    ITEM_COUNT=$(echo "$ITEMS_RESPONSE" | grep -o '"_id"' | wc -l)
    
    if [ "$ITEM_COUNT" -ge 10 ]; then
        print_test 0 "Database contains seeded items ($ITEM_COUNT items found)"
    else
        print_test 1 "Insufficient seeded items (found $ITEM_COUNT, expected 12+)"
    fi
    
    # Test swaps
    SWAPS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
        http://localhost:5000/api/swaps)
    
    SWAP_COUNT=$(echo "$SWAPS_RESPONSE" | grep -o '"_id"' | wc -l)
    
    if [ "$SWAP_COUNT" -ge 3 ]; then
        print_test 0 "Database contains seeded swaps ($SWAP_COUNT swaps found)"
    else
        print_test 1 "Insufficient seeded swaps (found $SWAP_COUNT, expected 4+)"
    fi
else
    print_test 1 "Cannot test database - authentication failed"
fi

echo ""
echo -e "${BLUE}📚 Phase 5: Documentation Tests${NC}"
echo "================================="

# Test Swagger documentation
SWAGGER_TEST=$(curl -s -w "%{http_code}" http://localhost:5000/api/docs)
if echo "$SWAGGER_TEST" | grep -q "200"; then
    print_test 0 "Swagger documentation accessible"
else
    print_test 1 "Swagger documentation not accessible"
fi

# Check if Postman collection exists
if [ -f "ReWear.postman_collection.json" ]; then
    print_test 0 "Postman collection file exists"
else
    print_test 1 "Postman collection file missing"
fi

# Check if testing guide exists
if [ -f "TESTING.md" ]; then
    print_test 0 "Testing guide documentation exists"
else
    print_test 1 "Testing guide documentation missing"
fi

echo ""
echo -e "${BLUE}🔧 Phase 6: CI/CD Pipeline Tests${NC}"
echo "=================================="

# Check GitHub Actions workflows
if [ -d ".github/workflows" ]; then
    WORKFLOW_COUNT=$(find .github/workflows -name "*.yml" -o -name "*.yaml" | wc -l)
    if [ "$WORKFLOW_COUNT" -ge 2 ]; then
        print_test 0 "CI/CD workflows configured ($WORKFLOW_COUNT workflows found)"
    else
        print_test 1 "Insufficient CI/CD workflows (found $WORKFLOW_COUNT, expected 2+)"
    fi
else
    print_test 1 "No CI/CD workflows found"
fi

# Check package.json scripts
if grep -q "\"seed\"" package.json 2>/dev/null; then
    print_test 0 "Seeding scripts configured"
else
    print_test 1 "Seeding scripts not configured"
fi

echo ""
echo -e "${BLUE}🎯 Phase 7: Performance Tests${NC}"
echo "=============================="

# Test response times
if [ -n "$TOKEN" ]; then
    START_TIME=$(date +%s%N)
    curl -s -H "Authorization: Bearer $TOKEN" \
        http://localhost:5000/api/items > /dev/null
    END_TIME=$(date +%s%N)
    
    RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))  # Convert to ms
    
    if [ "$RESPONSE_TIME" -lt 1000 ]; then
        print_test 0 "API response time acceptable (${RESPONSE_TIME}ms)"
    else
        print_test 1 "API response time too slow (${RESPONSE_TIME}ms)"
    fi
else
    print_test 1 "Cannot test performance - authentication failed"
fi

echo ""
echo "====================================="
echo -e "${YELLOW}📊 FINAL VALIDATION RESULTS${NC}"
echo "====================================="

echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
SUCCESS_RATE=$((TESTS_PASSED * 100 / TOTAL_TESTS))

echo -e "Success Rate: ${GREEN}$SUCCESS_RATE%${NC}"

if [ "$TESTS_FAILED" -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 ALL SYSTEMS OPERATIONAL!${NC}"
    echo -e "${GREEN}✅ ReWear is ready for judge demonstration${NC}"
    echo ""
    echo -e "${BLUE}🚀 Quick Start for Judges:${NC}"
    echo "1. Frontend: http://localhost:3000"
    echo "2. API Docs: http://localhost:5000/api/docs"
    echo "3. Test Login: admin@rewear.com / admin123"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  ISSUES DETECTED!${NC}"
    echo -e "${YELLOW}Please check the failed tests above${NC}"
    echo ""
    echo -e "${BLUE}Troubleshooting:${NC}"
    echo "1. Ensure MongoDB is running"
    echo "2. Run 'npm run seed:reset' to reset database"
    echo "3. Start backend: 'cd server && npm start'"
    echo "4. Start frontend: 'cd client && npm start'"
    echo ""
    exit 1
fi
