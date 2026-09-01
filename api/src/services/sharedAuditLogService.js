import { AuditLogRepository } from '../repositories/auditLogRepository.js';
import { UserRepository } from '../repositories/userRepository.js';
import { AuditLogService } from './auditLogService.js';
import { EmailService } from './emailService.js';

// One shared instance instead of each router building its own: without a real
// IoC container (this repo deliberately doesn't have one, see CLAUDE.md), an
// ES module import is already a singleton, and that's all this needs. Sharing
// the instance also means the write-failure alert cooldown in
// auditLogService.js applies across every router, not once per router.
export const auditLogService = new AuditLogService(
    new AuditLogRepository(),
    new UserRepository(),
    new EmailService()
);
