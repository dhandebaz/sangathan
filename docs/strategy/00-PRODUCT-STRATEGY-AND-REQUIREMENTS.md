# Sangathan: Product Strategy & Requirements Outline

## 1. Executive Summary

Sangathan is a multi-tenant civic organisation platform designed to help different types of organizations manage operations, grow effectively, and remain compliant. Built with Next.js and Supabase, it provides institutional-grade infrastructure for mission-driven collectives without ideological bias.

This document outlines the comprehensive product strategy, including target organization types, core modules, user roles, key workflows, compliance requirements, integrations, scalability needs, monetization options, MVP scope, and implementation roadmap.

## 2. Target Organization Types

Sangathan serves three primary tiers of organizations, each with distinct needs and barriers:

### 2.1 Primary Users (Core Focus)
- **Small NGOs (10-50 staff)**: Struggling with compliance and data loss; need low-cost reliability
- **Student Unions**: High turnover, chaotic membership data; need continuity and institutional memory
- **Grassroots Collectives (Samitis, RWAs, Clubs)**: Running on WhatsApp/Excel; need structure and simplicity

### 2.2 Secondary Users (Scale Focus)
- **Mid-size NGOs**: Using expensive software (Salesforce/Zoho) but overpaying; need feature parity at lower cost
- **Advocacy Networks**: Need to coordinate across multiple chapters; require federated data structures

### 2.3 Tertiary Users (Long Tail)
- **Local Associations (RWAs, Clubs)**: Need simple dues collection and meeting logs
- **Professional Associations**: Require member directories and event management
- **Religious Institutions**: Need donation tracking and volunteer coordination

## 3. Core Modules

Sangathan's functionality is organized into modular capabilities that can be enabled/disabled per organization based on their needs and readiness:

### 3.1 Foundational Modules (Always Available)
- **Member Management**: Profile management, roles, permissions, import/export
- **Communication**: Announcements, newsletters, targeted messaging
- **Document Repository**: Secure file storage with versioning and access controls
- **Meeting Management**: Scheduling, attendance tracking, minutes recording
- **Basic Reporting**: Membership stats, activity logs, export capabilities

### 3.2 Capability-Gated Modules (Feature Flags)
| Module | Description | Default State |
|--------|-------------|---------------|
| **Advanced Analytics** | Deep insights into engagement, growth, and retention patterns | `false` |
| **Federation Mode** | Cross-org linking, joint events, coalition management | `false` |
| **Voting Engine** | Formal and informal polling system with various voting methods | `false` |
| **Volunteer Engine** | Task management, hour logging, shift scheduling | `false` |
| **Transparency Mode** | Public-facing stats and charter adherence badge (opt-in) | `true` |
| **Financial Ledger** | Donation tracking, expense management, financial reporting | `false` |
| **Event Management** | Registration, ticketing, attendance tracking for events | `false` |
| **Compliance Tracker** | Regulatory filing reminders, document management for audits | `false` |

### 3.3 Administrative Modules (System Level)
- **Organization Management**: Tenant creation, billing, capability assignment
- **User Administration**: Role-based access control, audit logging
- **Platform Monitoring**: Health checks, performance metrics, error tracking
- **Backup & Recovery**: Automated backups, disaster recovery procedures
- **Security Administration**: Policy management, threat monitoring

## 4. User Roles & Permissions

Sangathan implements a hierarchical role system with granular permissions:

### 4.1 Organization-Level Roles
- **Super Admin**: Full access to all organization settings and data
- **Admin**: Manage members, content, and most settings (cannot change org-level capabilities)
- **Moderator**: Content management, member approval, limited settings access
- **Member**: View org content, participate in votes/events, update profile
- **Volunteer**: Task assignment and hour tracking (when volunteer engine enabled)
- **Viewer**: Read-only access to public-facing content (when transparency mode enabled)

### 4.2 Platform-Level Roles
- **Platform Administrator**: Manage tenant infrastructure, billing, system-wide settings
- **Support Agent**: View org data for troubleshooting (limited access, audit logged)
- **Auditor**: Read-only access for compliance verification
- **Developer**: API access (when enabled) with rate limiting and scoped permissions

### 4.3 Permission Matrix Example
| Action | Super Admin | Admin | Moderator | Member |
|--------|-------------|-------|-----------|--------|
| Invite members | ✓ | ✓ | ✗ | ✗ |
| Remove members | ✓ | ✓ | ✗ | ✗ |
| Change member roles | ✓ | ✓ | ✗ | ✗ |
| Create announcements | ✓ | ✓ | ✓ | ✗ |
| Edit announcements | ✓ | ✓ | ✓ (own only) | ✗ |
| Delete announcements | ✓ | ✓ | ✗ | ✗ |
| Upload documents | ✓ | ✓ | ✓ | ✗ |
| Delete documents | ✓ | ✓ | ✗ | ✗ |
| Schedule meetings | ✓ | ✓ | ✓ | ✗ |
| Record attendance | ✓ | ✓ | ✓ | ✗ |
| Export member data | ✓ | ✓ | ✗ | ✗ |
| View financial reports | ✓ | ✓* | ✗ | ✗ |
| Enable/disable capabilities | ✓ | ✗ | ✗ | ✗ |

*Note: Financial reports only visible when Financial Ledger capability is enabled

## 5. Key Workflows

### 5.1 Member Lifecycle Workflow
1. **Onboarding**: Invitation via email/WhatsApp → Profile completion → Role assignment
2. **Engagement**: Access to member portal → Participation in discussions/events → Activity tracking
3. **Offboarding**: Role change or removal → Data retention per policy → Optional export before deletion
4. **Re-engagement**: Reactivation workflow with data restoration option

### 5.2 Meeting Management Workflow
1. **Planning**: Create meeting → Set agenda → Invite members → Attach documents
2. **Execution**: Track attendance → Record decisions → Capture action items
3. **Follow-up**: Distribute minutes → Assign tasks → Track completion → Archive meeting records

### 5.3 Financial Transaction Workflow (when enabled)
1. **Donation Recording**: Receive donation → Record in ledger → Send receipt → Update donor profile
2. **Expense Management**: Submit expense → Approval workflow → Payment processing → Category tagging
3. **Financial Reporting**: Generate reports → Export for audit → Share with stakeholders (selective transparency)
4. **Compliance**: Automated reminders for filing deadlines → Document collection → Audit trail generation

### 5.4 Event Management Workflow (when enabled)
1. **Creation**: Define event details → Set registration fees → Create forms → Publish
2. **Registration**: Member sign-up → Payment processing → Confirmation → Waitlist management
3. **Execution**: Check-in tracking → Session attendance → Feedback collection
4. **Post-Event**: Attendance certificates → Financial reconciliation → Impact reporting → Archive

### 5.5 Voting Process Workflow (when enabled)
1. **Proposal Submission**: Draft proposal → Review period → Finalize ballot
2. **Voting Period**: Open voting → Reminder system → Fraud detection → Real-time tallying
3. **Results**: Secure result publishing → Objection period → Certification → Implementation tracking

## 6. Compliance Requirements

Sangathan is designed to help organizations meet various regulatory requirements:

### 6.1 Data Protection & Privacy
- **GDPR/PDPA Compliance**: Consent management, right to access/portability/erasure
- **Data Localization Options**: Regional data storage for organizations with sovereignty requirements
- **Encryption**: At-rest and in-transit encryption for all sensitive data
- **Access Controls**: Role-based access with principle of least privilege
- **Audit Logging**: Immutable logs for all data access and modifications

### 6.2 Organizational Compliance
- **Societies Registration Act**: Membership register maintenance, meeting minutes archival
- **FCRA Compliance**: Foreign contribution tracking and reporting (for Indian NGOs)
- **Income Tax Act**: 80G donation receipts, financial statement preparation
- **Corporate Governance**: Board meeting minutes, resolution tracking, conflict of interest declarations
- **Annual Filing**: Automated reminders for annual returns, financial statements

### 6.3 Platform Compliance
- **IT Act 2000**: Intermediary guidelines, cybersecurity standards
- **Accessibility**: WCAG 2.1 AA compliance for all user interfaces
- **Data Retention**: Configurable retention policies with automated archival/deletion
- **Third-party Audits**: Regular security assessments and penetration testing
- **Transparency Reports**: Bi-annual publication of government requests and platform actions

## 7. Integrations

Sangathan provides pre-built integrations and extension points:

### 7.1 Native Integrations
- **Authentication**: Email/password, WhatsApp OTP, OAuth (Google, Microsoft)
- **Communication**: Email (SendGrid/SMTP), SMS (Twilio), WhatsApp Business API
- **Payments**: Razorpay, Stripe, Paytm for donations and fees
- **Storage**: Supabase Storage (encrypted), optional IPFS integration for sensitive documents
- **Calendar**: Google Calendar, Outlook integration for meeting scheduling
- **Video Conferencing**: Zoom, Jitsi Meet links for virtual meetings

### 7.2 API & Extension Framework
- **REST API**: Full CRUD access to non-sensitive organization data (with authentication)
- **Webhooks**: Real-time notifications for key events (member added, donation received, etc.)
- **Plugin System**: Future marketplace for community-built extensions
- **Custom Fields**: Extensible member and organization profiles with validation rules
- **Branding**: White-label options for emails, portal themes, and domain mapping

### 7.3 Ecosystem Partnerships
- **Legal & Accounting**: Partner networks for compliance services
- **Technology Providers**: Discounted rates on complementary tools (email marketing, design)
- **Funding Platforms**: Integration with grant management and crowdfunding platforms
- **Training Providers**: Access to governance and management training resources

## 8. Scalability & Performance

### 8.1 Technical Scalability
- **Multi-tenant Architecture**: Shared infrastructure with logical data separation via Row Level Security (RLS)
- **Horizontal Scaling**: Stateless services that can scale independently based on load
- **Database Optimization**: Indexing strategies, connection pooling, read replicas for analytics
- **Caching Strategy**: Redis-based caching for frequent queries, CDN for static assets
- **Load Testing**: Regular performance testing with simulated organizational loads

### 8.2 Usage Scaling
- **Organization Size**: Support for organizations from 10 to 100,000+ members
- **Activity Levels**: Handle organizations with varying engagement frequencies
- **Storage Scaling**: Transparent scaling of storage quotas based on usage
- **API Rate Limiting**: Tiered limits based on organization plan and usage patterns
- **Background Jobs**: Efficient processing of bulk operations (imports, exports, notifications)

### 8.3 Geographic Considerations
- **Multi-region Deployment**: Option for organizations to select preferred data regions
- **Low-bandwidth Mode**: Optimized interface for areas with limited connectivity
- **Offline Capabilities**: Limited offline functionality with sync when connectivity restored
- **Localization**: Multi-language support (Hindi, English, and major regional languages)

## 9. Monetization Options for Organizations

Sangathan follows a mission-aligned pricing model focused on accessibility and value:

### 9.1 Pricing Tiers
- **Community Plan**: Free for organizations with <50 members and basic needs
  - Includes: Member management, announcements, document storage, basic meetings
  - Limits: 2GB storage, 1000 monthly emails, core modules only
  
- **Growth Plan**: ₹499/month (billed annually) for organizations 50-500 members
  - Includes: All core modules + Financial Ledger + Event Management + Basic Analytics
  - Limits: 50GB storage, 10k monthly emails, priority support
  
- **Impact Plan**: ₹1299/month (billed annually) for organizations >500 members or advanced needs
  - Includes: All modules + Advanced Analytics + Federation Mode + Volunteer Engine
  - Limits: 200GB storage, 50k monthly emails, dedicated support, SLA
  
- **Enterprise Plan**: Custom pricing for large networks, federations, or special requirements
  - Includes: Custom SLAs, dedicated infrastructure, on-premise options, custom development
  - Limits: Negotiable based on requirements

### 9.2 Add-on Services
- **Data Migration Assistance**: One-time fee for importing from legacy systems
- **Training & Onboarding**: Customized training sessions for admins and members
- **Custom Development**: Hourly rate for platform extensions or custom integrations
- **Compliance Review**: Periodic compliance checks and report generation
- **White-labeling**: Custom branding and domain mapping services

### 9.3 Non-Revenue Sustainability
- **Supporter Program**: ₹99/month for individuals who believe in the mission (no platform features)
- **Grants & Philanthropy**: Funding from foundations aligned with digital public goods mission
- **Partnership Revenue**: Revenue sharing from approved ecosystem partners
- **Impact Bonds**: Future possibility of outcome-based funding from government agencies

## 10. MVP Scope (Minimum Viable Product)

The initial release focuses on validating core value proposition with essential functionality:

### 10.1 Core Features (MVP v1.0)
- **Organization Creation**: Self-service signup with email verification
- **Member Management**: Basic profiles, roles, invitation system
- **Communication**: Announcements and member-directed messaging
- **Document Repository**: Secure file upload/download with access controls
- **Meeting Management**: Scheduling, attendance tracking, basic minutes
- **Transparency Mode**: Optional public profile page with basic stats
- **Authentication**: Email/password + WhatsApp OTP options
- **Admin Dashboard**: Organization overview, member list, activity feed
- **Member Portal**: Personal profile, organization access, notification center
- **Basic Reporting**: Membership statistics, activity exports (CSV)

### 10.2 Excluded from MVP (Future Phases)
- Financial Ledger module
- Advanced Analytics dashboard
- Voting Engine
- Volunteer Management
- Event Management (complex)
- Federation Capabilities
- API Access (public)
- Custom Domains
- Advanced Integrations (payment gateways, calendars)
- Multi-language Support (initial launch in English/Hindi only)
- Mobile Applications (responsive web only)

### 10.3 Success Criteria for MVP
- 50 founding organizations successfully onboarded
- 80% week-over-week retention of active organizations
- <2% critical error rate in core workflows
- Average time to complete key tasks <5 minutes
- Positive feedback from 75% of surveyed users on core usability
- Infrastructure costs covered by supporter program (break-even goal)

## 11. Implementation Roadmap

### 11.1 Phase 1: Foundation & MVP (Months 1-4)
**Goal**: Establish core platform and validate with founding organizations

**Month 1**: Core Infrastructure & Auth
- Supabase project setup with RLS policies
- Authentication system (email/password, WhatsApp OTP)
- Organization and member data models
- Basic admin dashboard for org creation
- Security foundation (encryption, audit logging)

**Month 2**: Member Management & Communication
- Member profiles, roles, permissions
- Invitation system (email/WhatsApp)
- Announcements creation and delivery
- Basic notification system
- Member portal foundation

**Month 3**: Collaboration Core
- Document repository with access controls
- Meeting management (scheduling, attendance)
- Basic reporting and export functions
- Transparency mode implementation
- Responsive UI framework

**Month 4**: MVP Polish & Beta Launch
- Bug fixing and performance optimization
- User testing and feedback incorporation
- Documentation and help center
- Controlled beta launch with 50 founding organizations
- Initial supporter program launch

### 11.2 Phase 2: Growth & Essential Features (Months 5-8)
**Goal**: Expand functionality and begin scaling

**Month 5**: Financial Management
- Financial ledger module (donations, expenses)
- Basic financial reporting
- Payment gateway integration (Razorpay starter)
- Donation receipt generation
- Expense approval workflow

**Month 6**: Events & Engagement
- Basic event management (creation, registration)
- Attendance tracking for events
- Simple ticketing system
- Integration with communication module
- Feedback collection system

**Month 7**: Administrative Enhancements
- Advanced role-based permissions
- Organization settings management
- Backup and recovery systems
- Platform monitoring and alerting
- Data export/import utilities

**Month 8**: Scaling & Optimization
- Performance optimization and load testing
- Mobile responsiveness improvements
- Multi-language support expansion (major regional languages)
- Analytics dashboard (basic usage metrics)
- Preparation for public release

### 11.3 Phase 3: Public Release & Ecosystem (Months 9-12)
**Goal**: Public availability and ecosystem development

**Month 9**: Public Launch Preparation
- Final security audit and penetration testing
- Compliance validation (GDPR/PDPA readiness)
- Documentation completion (user guides, admin manuals)
- Marketing materials and press kit
- Public launch announcement

**Month 10**: Public Release & Growth
- Remove invitation requirements for public access
- Digital marketing campaigns (targeted sectors)
- Referral program implementation
- Content marketing launch (governance insights)
- First case study publications

**Month 11**: Ecosystem Development
- API access launch (limited, rate-controlled)
- Initial integration partnerships (payments, calendars)
- Ambassador program launch (campus coordinators)
- Plugin system architecture planning
- Second wave of case studies

**Month 12**: Platform Maturation
- Advanced analytics features
- Volunteer management module
- Federation mode prototyping
- Transparency dashboard enhancements
- Annual planning for year 2
- Impact assessment and metrics review

### 11.4 Year 2 Vision: The Platform
- Full API release with developer portal
- Advanced federation capabilities for networks
- Volunteer-driven workflows and hour tracking
- Plugin marketplace for community extensions
- Grant management module for NGOs
- Public transparency portal for impact reporting
- Mobile application development (optional)

### 11.5 Year 3 Vision: The Network
- NGO marketplace for service provider connections
- Advanced coalition tools for large-scale coordination
- AI-assisted governance insights (optional)
- Interoperability standards with other civic platforms
- International expansion preparation
- Impact bond pilot programs

## 12. Risk Mitigation & Assumptions

### 12.1 Key Risks
- **Adoption Resistance**: Mitigated by phased onboarding, white-glove service for founding orgs
- **Technical Complexity**: Addressed through modular capability system and progressive disclosure
- **Trust Concerns**: Solved by radical transparency, open architecture, and data ownership guarantees
- **Sustainability Risk**: Managed through diversified revenue (supporters, grants, enterprise)
- **Competition**: Differentiated by mission focus, neutrality, and purpose-built design

### 12.2 Key Assumptions
- Organizations value institutional longevity over short-term convenience
- Data sovereignty and privacy are primary concerns for target users
- There is willingness to pay for reliable, mission-aligned infrastructure
- The modular capability approach reduces complexity for early-stage organizations
- Civic sector collaboration precedes competition in the target market

## 13. Success Metrics & Evaluation

### 13.1 North Star Metric
- **Weekly Active Organizations**: Orgs performing ≥1 critical action per week (meeting log, donation verification, member addition, form submission)

### 13.2 Health Metrics
- **Admin Retention**: % of admins active 3 months after signup
- **Data Density**: Average members per organization (indicates real usage vs. testing)
- **Supporter Conversion**: % of active orgs converting to paid supporter program
- **Module Adoption Rate**: % of enabled capabilities used monthly
- **Support Ticket Resolution Time**: Average time to resolve user issues

### 13.3 Impact Metrics
- **Hours Saved**: Estimated administrative time saved per organization per month
- **Compliance Improvement**: Self-reported improvement in regulatory readiness
- **Member Engagement Increase**: Growth in member participation metrics
- **Organizational Longevity**: Tracking of org survival rates vs. sector averages
- **Network Effect**: Growth in cross-organization collaborations enabled

### 13.4 Evaluation Cadence
- **Weekly**: Platform health, error rates, basic usage metrics
- **Monthly**: Growth metrics, financials, user feedback summary
- **Quarterly**: Deep-dive analysis, strategy adjustments, OKR setting
- **Annually**: Comprehensive impact review, long-term planning, stakeholder feedback

---

*This document represents a living strategy that will evolve based on user feedback, market conditions, and organizational learning. Regular reviews and updates are essential to maintain alignment with Sangathan's mission and vision.*