const fs = require('fs');
const path = require('path');

const eslintOutput = `
C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\analytics\\admin-metrics.controller.ts
  4:19  error  'startOfDay' is defined but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\analytics\\metrics.service.ts
  2:22  error  'endOfDay' is defined but never used  @typescript-eslint/no-unused-vars
  3:16  error  'frLocale' is defined but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\audit\\audit.controller.ts
  4:10  error  'logAudit' is defined but never used           @typescript-eslint/no-unused-vars
  6:10  error  'requireAuth' is defined but never used        @typescript-eslint/no-unused-vars
  7:10  error  'requirePermission' is defined but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\billing\\invoice\\invoice.service.ts
  2:18  error  'isStripeMock' is defined but never used   @typescript-eslint/no-unused-vars
  4:10  error  'env' is defined but never used            @typescript-eslint/no-unused-vars
  6:10  error  'PaymentStatus' is defined but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\billing\\invoice\\invoices.controller.ts
   7:3   error  'parsePagination' is defined but never used  @typescript-eslint/no-unused-vars
  20:10  error  'Prisma' is defined but never used           @typescript-eslint/no-unused-vars
  20:18  error  'InvoiceStatus' is defined but never used    @typescript-eslint/no-unused-vars
  20:33  error  'PaymentMethod' is defined but never used    @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\billing\\subscription\\billing.controller.ts
  3:18  error  'isStripeMock' is defined but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\hotel\\hotel.service.ts
  6:41  error  'Pagination' is defined but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\hotel\\housekeeping\\housekeeping.controller.ts
  18:23  error  'HousekeepingStatus' is defined but never used  @typescript-eslint/no-unused-vars
  18:43  error  'HousekeepingType' is defined but never used    @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\identity\\auth\\auth.controller.ts
  164:25  error  '_' is assigned a value but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\identity\\auth\\auth.middleware.ts
  7:3  error  ES2015 module syntax is preferred over namespaces  @typescript-eslint/no-namespace

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\identity\\user\\leads.controller.ts
  42:9  error  'lead' is assigned a value but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\shared\\middleware\\tenant.middleware.ts
  1:24  error  'Response' is defined but never used               @typescript-eslint/no-unused-vars
  1:34  error  'NextFunction' is defined but never used           @typescript-eslint/no-unused-vars
  5:3   error  ES2015 module syntax is preferred over namespaces  @typescript-eslint/no-namespace

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\domains\\user\\user.controller.ts
  1:10  error  'ApiError' is defined but never used         @typescript-eslint/no-unused-vars
  5:10  error  'assertSameHotel' is defined but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\infrastructure\\payment\\stripe.client.ts
  55:38  error  'signature' is defined but never used. Allowed unused args must match /^_/u  @typescript-eslint/no-unused-vars
  55:57  error  'secret' is defined but never used. Allowed unused args must match /^_/u     @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\jobs\\weekly-report.job.ts
  58:15  error  'html' is assigned a value but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\lib\\migrate-to-postgres.ts
  15:26  error  'SqliteClient' is defined but never used  @typescript-eslint/no-unused-vars
  16:10  error  'execSync' is defined but never used      @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\routes\\rooms.routes.ts
  4:10  error  'auditMiddleware' is defined but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\services\\affiliate.service.ts
  61:48  error  'ip' is defined but never used. Allowed unused args must match /^_/u         @typescript-eslint/no-unused-vars
  61:61  error  'userAgent' is defined but never used. Allowed unused args must match /^_/u  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\services\\channels\\airbnb.connector.ts
  71:26  error  'channel' is defined but never used. Allowed unused args must match /^_/u     @typescript-eslint/no-unused-vars
  71:44  error  'since' is defined but never used. Allowed unused args must match /^_/u       @typescript-eslint/no-unused-vars
  76:27  error  'channel' is defined but never used. Allowed unused args must match /^_/u     @typescript-eslint/no-unused-vars
  76:45  error  'externalId' is defined but never used. Allowed unused args must match /^_/u  @typescript-eslint/no-unused-vars
  76:65  error  'reason' is defined but never used. Allowed unused args must match /^_/u      @typescript-eslint/no-unused-vars
  80:37  error  'headers' is defined but never used. Allowed unused args must match /^_/u     @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\services\\channels\\mock-ota.connector.ts
  30:22  error  'credentials' is defined but never used. Allowed unused args must match /^_/u  @typescript-eslint/no-unused-vars
  50:44  error  'since' is defined but never used. Allowed unused args must match /^_/u        @typescript-eslint/no-unused-vars
  83:27  error  'channel' is defined but never used. Allowed unused args must match /^_/u      @typescript-eslint/no-unused-vars
  83:45  error  'externalId' is defined but never used. Allowed unused args must match /^_/u   @typescript-eslint/no-unused-vars
  83:65  error  'reason' is defined but never used. Allowed unused args must match /^_/u       @typescript-eslint/no-unused-vars
  88:37  error  'headers' is defined but never used. Allowed unused args must match /^_/u      @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\services\\housekeeping.service.ts
  2:43  error  'isBefore' is defined but never used  @typescript-eslint/no-unused-vars
  3:33  error  'Prisma' is defined but never used    @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\services\\segmentation.service.ts
  55:11  error  'cancellations' is assigned a value but never used  @typescript-eslint/no-unused-vars

C:\\Users\\pc gold\\projet dash\\luxury-hotel-operations-command-center\\backend\\src\\socket.ts
  5:10  error  'prisma' is defined but never used  @typescript-eslint/no-unused-vars
`;

const lines = eslintOutput.split('\\n');
let currentFile = null;

for (const line of lines) {
  if (line.trim() === '') continue;
  
  if (line.startsWith('C:\\\\')) {
    currentFile = line.trim();
    continue;
  }
  
  const match = line.match(/\\s+(\\d+):(\\d+)\\s+error\\s+'([^']+)' is (defined|assigned a value) but never used/);
  if (match && currentFile) {
    const lineNum = parseInt(match[1], 10);
    const varName = match[3];
    const type = match[4]; // defined or assigned a value
    
    let content = fs.readFileSync(currentFile, 'utf8');
    let fileLines = content.split('\\n');
    let targetLine = fileLines[lineNum - 1];
    
    if (type === 'defined') {
      if (targetLine.includes('import')) {
        // It's an unused import. Just try to remove the word, or if it's the only one, remove the line
        targetLine = targetLine.replace(new RegExp('\\\\b' + varName + '\\\\b(,\\s*)?'), '');
        targetLine = targetLine.replace(/,\\s*\\}/, ' }').replace(/\\{\\s*\\}/, '');
        if (targetLine.trim().startsWith('import') && !targetLine.includes('{') && !targetLine.match(/from\\s+['"]/)) {
           // empty import
           targetLine = '';
        }
        if (targetLine.trim().startsWith("import from '")) targetLine = ''; // hack
      } else {
        // Parameter or something else. Prefix with _
        targetLine = targetLine.replace(new RegExp('\\\\b' + varName + '\\\\b'), '_' + varName);
      }
    } else if (type === 'assigned a value') {
        // Usually something like `const lead = await ...`
        // We can just replace `const varName = ` with ``
        targetLine = targetLine.replace(new RegExp('(const|let|var)\\s+' + varName + '\\s*=\\s*'), '');
    }
    
    fileLines[lineNum - 1] = targetLine;
    fs.writeFileSync(currentFile, fileLines.join('\\n'), 'utf8');
  }
}
