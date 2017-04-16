
#import "HelpViewController.h"
#import <MessageUI/MessageUI.h>
#import <sys/utsname.h>

@interface HelpViewController () <MFMailComposeViewControllerDelegate>

@end

@implementation HelpViewController
@synthesize umVc=_umVc;
@synthesize lbLogCount = _lbLogCount;
@synthesize btnEmail = _btnEmail;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
    }
    return self;
}

/*
- (void)dealloc {
    [_lbLogCount release];
    [_btnEmail release];
    [super dealloc];
}
*/

- (void)viewDidLoad {
    [super viewDidLoad];
    [self removeAllSavedLogs];
}

- (void)viewDidUnload {
    [super viewDidUnload];
}

- (void)viewWillAppear:(BOOL)animated {
    [self refreshLogFileCount];
    
    [super viewWillAppear: animated];
}

//-----------------------------------------------------------------------------
#pragma mark - log -
//-----------------------------------------------------------------------------
//return the directory where we save log files
-(NSString*) getLogDirectory {
    NSString *dir = [NSHomeDirectory() stringByAppendingPathComponent: @"/Documents/"];
    return dir;
}

//returns an array of NSString that are full path of files in the log directory
-(NSArray*) getLogFiles {
    #if (TARGET_IPHONE_SIMULATOR)
        return [NSArray array];
    #endif
    //find how many log files in dir
    NSString *dir = [self getLogDirectory];
    NSFileManager* fm = [NSFileManager defaultManager];
    NSURL *dirUrl = [NSURL URLWithString: dir];
    NSError *err=nil;
    NSArray *urlArray =
        [fm contentsOfDirectoryAtURL:dirUrl includingPropertiesForKeys:nil options:0 error: &err];
    if (err != nil) {
        NSLog(@"Enumerating log directory failed: %@", err.description);
        return nil;
    }
    //filter
    NSMutableArray *filteredArray = [NSMutableArray array];
    for (NSURL *url in urlArray) {
        NSNumber *isDir;
        [url getResourceValue:&isDir forKey:NSURLIsDirectoryKey error:&err];
        if (! [isDir boolValue])
            [filteredArray addObject: url.path];
    }
    return filteredArray;
}

//remove all saved logs
-(void) removeAllSavedLogs {
    NSFileManager *fm = [NSFileManager defaultManager];
    NSArray* filePaths = [self getLogFiles];
    for (NSString *path in filePaths) {
        NSError *err = nil;
        [fm removeItemAtPath: path error: &err];
        if (err)
            NSLog(@"Failed to remove log file: %@", err.description);
    }
    
    [self refreshLogFileCount];
}

//refresh UI based on how many saved logs there are
-(void) refreshLogFileCount {
    NSArray* filePaths = [self getLogFiles];
    NSUInteger count = filePaths.count;
    if (count != 0) {
        self.lbLogCount.text = [NSString stringWithFormat: @"%lu log files saved", (unsigned long)count];
        self.btnEmail.enabled = TRUE;
    }
    else {
        self.lbLogCount.text = @"No log files saved";
        self.btnEmail.enabled = FALSE;
    }
}

//action: 
- (IBAction)changeLogEnable:(id)sender {
    UISwitch *s = sender;
    if (s.on) {
        //enable
        [self.umVc.uniReader setWavePath:
            [[self getLogDirectory] stringByAppendingPathComponent: @"audio.wav"]];
    }
    else {
        //disable
        [self.umVc.uniReader setWavePath: nil];
        
        [self removeAllSavedLogs];
    }
}

//-----------------------------------------------------------------------------
#pragma mark - emailing log for troubleshooting -
//-----------------------------------------------------------------------------
-(NSString*) getInfoText {
    struct utsname systemInfo;
    uname(&systemInfo);
    NSString *model = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
    NSString *iOSversion = [UIDevice currentDevice].systemVersion;
    NSString *umVersion = [uniMag SDK_version];
    
    NSString *ret = [NSString stringWithFormat:
        @"iOS device model: %@\r\n"
        @"iOS version: %@\r\n"
        @"iOS UniMag SDK version: %@\r\n",
        model, iOSversion, umVersion];
    return ret;
}

- (IBAction) emailLog
{
	if ([MFMailComposeViewController canSendMail])
	{
		MFMailComposeViewController *mailVc = [[MFMailComposeViewController alloc] init];
		mailVc.mailComposeDelegate = self;
		[mailVc setSubject:@"iOS UniMag Log"];
		[mailVc setMessageBody: [self getInfoText] isHTML:FALSE];

        //add attachments
        NSArray *logs = [self getLogFiles];
        for (NSString *path in logs) {
            NSData *attachment = [NSData dataWithContentsOfFile: path];
            NSString *mimeType = nil;
            
            [mailVc addAttachmentData:attachment mimeType:mimeType fileName:path.lastPathComponent];
        }
		
		[self presentViewController:mailVc animated:YES completion: nil];
	}
	else 
	{
        UIAlertView *alertView = [[UIAlertView alloc]
            initWithTitle:nil
            message:@"Email needs to be set up in Settings > Mail, Contacts, Calendars"
            delegate:nil
            cancelButtonTitle:@"Ok"
            otherButtonTitles:nil];
        [alertView show];
        //[alertView release];
	}
}

- (void)mailComposeController:(MFMailComposeViewController*)controller 
    didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error 
{
	[self.umVc becomeFirstResponder];
	[self dismissViewControllerAnimated:YES completion: nil];
}

@end
