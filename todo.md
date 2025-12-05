# Patient Health Survey - TODO

## Backend Setup
- [x] Create backend directory structure (server/, database/, auth/)
- [x] Set up PostgreSQL database schema with Drizzle ORM
- [x] Create database tables (users, patients, surveys, recommendations, audit_logs)
- [x] Implement authentication system with JWT
- [x] Create tRPC API routers (auth, patients, surveys)
- [x] Set up Express server with tRPC middleware

## Frontend-Backend Integration
- [ ] Install tRPC client dependencies
- [ ] Configure tRPC client in frontend
- [ ] Create authentication context and hooks
- [ ] Build login/registration UI
- [ ] Implement protected routes

## Patient Management
- [ ] Create patient list view
- [ ] Implement patient creation form
- [ ] Add patient edit functionality
- [ ] Connect patient data to backend

## Survey Integration
- [ ] Connect questionnaire submission to backend
- [ ] Store survey responses in database
- [ ] Implement survey history view
- [ ] Add survey results dashboard

## Doctor Dashboard
- [ ] Build doctor dashboard with patient list
- [ ] Display survey history per patient
- [ ] Show detailed survey results with recommendations
- [ ] Add filtering and search functionality

## Testing & Deployment
- [ ] Test complete authentication flow
- [ ] Test survey submission and retrieval
- [ ] Test patient management operations
- [ ] Create checkpoint for deployment
