# Development Commands Cheat Sheet

## Start Development
```bash
# Từ root directory
npm run dev:client          # Chạy React (port 3001)
npm run dev                  # Chạy Backend (port 5000)
npm run concurrently         # Chạy cả 2 cùng lúc
```

## Testing URLs
```
Main Page:  http://localhost:3001/
Login:      http://localhost:3001/login  
Signup:     http://localhost:3001/signup
API:        http://localhost:5000/
```

## Quick Tests
```
✅ Navigation works
✅ Forms submit
✅ Responsive design  
✅ Images load
✅ Styling correct
✅ No console errors
```

## File Structure để edit
```
frontend-react/src/
  ├── components/          # Edit navbar, footer
  ├── pages/              # Edit main pages
  ├── styles/             # Edit CSS modules
  └── assets/images/      # Add/change images
```