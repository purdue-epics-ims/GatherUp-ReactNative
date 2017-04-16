
#import "UniMagViewController.h"
#import "AboutScreenViewController.h"
#import "UMCardData.h"

@interface UniMagViewController ()
{
	UIAlertView *prompt_connecting;
	UIAlertView *prompt_waitingForSwipe;
}

@property (retain, nonatomic) NSDate *connectionStartTime;
@property (retain, nonatomic) NSDate *swipeStartTime;

@end

@implementation UniMagViewController
@synthesize svRoot = _svRoot;

@synthesize attachedLabel = _attachedLabel;
@synthesize connectedLabel=_connectedLabel;
@synthesize btnConnect = _btnConnect;
@synthesize	textResponse=_textResponse;
@synthesize	hexResponse=_hexResponse;
@synthesize vvRoot = _vvRoot;
@synthesize vHeader = _vHeader;
@synthesize tabBar = _tabBar;
@synthesize tabList_tbi = _tabList_tbi;
@synthesize tabList_vc = _tabList_vc;
@synthesize subvcThatNeedsViewWillAppearEvent = _subvcThatNeedsViewWillAppearEvent;
@synthesize btnSendCommand = _btnSendCommand;
@synthesize btnSwipe = _btnSwipe;

@synthesize connectionStartTime=_connectionStartTime;
@synthesize swipeStartTime=_swipeStartTime;

@synthesize uniReader=uniReader;

//get C source code representation of a byte string
static NSString* repr(NSData* byteArray);

//-----------------------------------------------------------------------------
#pragma mark - view controller lifecycle -
//-----------------------------------------------------------------------------

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    self.svRoot.contentSize = self.vvRoot.frame.size;
        
    //register enter background notif (only available on iOS 4)
    NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
    [nc addObserver:self selector: @selector(applicationDidEnterBackground) 
        name:@"UIApplicationDidEnterBackgroundNotification" object:nil];
    
    //keyboard
    [self registerForKeyboardNotifications: TRUE];
    
    //init alert views
	prompt_connecting = [[UIAlertView alloc] 
        initWithTitle:@"UniMag"
        message:@"Connecting with UniMag."
        delegate:self
        cancelButtonTitle:@"Cancel"
        otherButtonTitles:nil];
	
	prompt_waitingForSwipe = [[UIAlertView alloc] 
        initWithTitle:@"UniMag"
        message:@"\n\n"
        delegate:self
        cancelButtonTitle:@"Cancel"
        otherButtonTitles:nil];
        
    //reset ui state
    [self setAttachedLabelState:FALSE];
    [self setConnectedLabelState:FALSE];
    self.btnConnect.enabled = FALSE;
    self.btnSendCommand.enabled = FALSE;
    self.btnSwipe.enabled = FALSE;
    
    //activate SDK
    [self umsdk_activate];
    
    //patch UI bug
    [self.subvcThatNeedsViewWillAppearEvent viewWillAppear: animated];
}

- (void)viewDidDisappear:(BOOL)animated
{
	[super viewDidDisappear:animated];
    
    //unregister enter background notif (iOS 4+)
    NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
    [nc removeObserver:self 
        name:@"UIApplicationDidEnterBackgroundNotification" object:nil];
    
    //keyboard
    [self registerForKeyboardNotifications: FALSE];
        
    //deallocate alert views
    [prompt_connecting release];
    prompt_connecting = nil;
    [prompt_waitingForSwipe release];
    prompt_waitingForSwipe = nil;
    
    //deactivate SDK
    [self umsdk_deactivate];
}


- (void)viewDidLoad {
    [super viewDidLoad];
    
	//set up nav bar buttons
	self.navigationItem.rightBarButtonItem = [[[UIBarButtonItem alloc] initWithTitle:@"About" 
        style:UIBarButtonItemStylePlain target:self action:@selector(goToAbout)]autorelease];
    
    //tab bar
    [self tabBarInit];
}


- (void)viewDidUnload {
    [self setVvRoot:nil];
    [self setTabBar:nil];
    [self setAttachedLabel:nil];
    [self setBtnSwipe:nil];
    [self setVHeader:nil];
    [self setBtnConnect:nil];
    [self setBtnSendCommand:nil];
    [self setTabList_tbi:nil];
    [self setTabList_vc:nil];
    [self setSvRoot:nil];
    [super viewDidUnload];
}

- (void)applicationDidEnterBackground {
#if 1==UMSDK_CUSTOMIZATION
    //leave main screen (deactivate sdk at the same time)
    [self dismissAllAlertViews];
    [self.navigationController popToRootViewControllerAnimated:NO];
#else
    //stop any running task
    [self dismissAllAlertViews];
    [uniReader cancelTask];
#endif
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void)dealloc
{
	[_connectedLabel release];
	[_textResponse release];
	[_hexResponse release];
    
    [_connectionStartTime release];
    [_swipeStartTime release];

    [_vvRoot release];
    [_tabBar release];
    [_attachedLabel release];
    [_btnSwipe release];
    [_vHeader release];
    [_btnConnect release];
    [_btnSendCommand release];
    [_tabList_tbi release];
    [_tabList_vc release];
    [_svRoot release];
    [super dealloc];
}

//-----------------------------------------------------------------------------
#pragma mark - ui actions -
//-----------------------------------------------------------------------------
- (IBAction)connectReader {
    UmRet ret = [uniReader startUniMag:TRUE];
    [self displayUmRet: @"Starting connection" returnValue: ret];
    self.connectionStartTime = [NSDate date];
}

-(IBAction) swipeCard {
    //start the swipe task. ie, cause SDK to start waiting for a swipe to be made
	UmRet ret = [uniReader requestSwipe];
    [self displayUmRet: @"Starting read swipe" returnValue: ret];
}

- (void)alertView:(const UIAlertView *)alertView didDismissWithButtonIndex:(NSInteger)buttonIndex{
    if (alertView == prompt_connecting)
	{
        //selected cancel connection at the connecting prompt.
        // This aborts the connect task
		if (0 == buttonIndex)
			[uniReader cancelTask];
	} else
    if (alertView == prompt_waitingForSwipe)
	{
        //selected cancel swipe at the swipe waiting prompt. 
        // This aborts the swipe task
		if (0 == buttonIndex) {
			[uniReader cancelTask];
            self.textResponse.text = @"Reading swipe canceled";
        }
	}
}

-(void)goToAbout {
	UIViewController *vc = [[[AboutScreenViewController alloc]
        initWithNibName:@"AboutScreenView" bundle:nil] autorelease];
	[self.navigationController pushViewController:vc animated:YES];
}

//-----------------------------------------------------------------------------
#pragma mark - uniMag SDK activation/deactivation -
//-----------------------------------------------------------------------------

-(void) umsdk_registerObservers:(BOOL) reg {
	NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
    
    //list of notifications and their corresponding selector
    const struct {NSString *n; SEL s;} noteAndSel[] = {
        //
        {uniMagAttachmentNotification       , @selector(umDevice_attachment:)},
        {uniMagDetachmentNotification       , @selector(umDevice_detachment:)},
        //
        {uniMagInsufficientPowerNotification, @selector(umConnection_lowVolume:)},
        {uniMagMonoAudioErrorNotification   , @selector(umConnection_monoAudioError:)},
        {uniMagPoweringNotification         , @selector(umConnection_starting:)},
        {uniMagTimeoutNotification          , @selector(umConnection_timeout:)},
        {uniMagDidConnectNotification       , @selector(umConnection_connected:)},
        {uniMagDidDisconnectNotification    , @selector(umConnection_disconnected:)},
        //
        {uniMagSwipeNotification            , @selector(umSwipe_starting:)},
        {uniMagTimeoutSwipeNotification     , @selector(umSwipe_timeout:)},
        {uniMagDataProcessingNotification   , @selector(umDataProcessing:)},
        {uniMagInvalidSwipeNotification     , @selector(umSwipe_invalid:)},
        {uniMagDidReceiveDataNotification   , @selector(umSwipe_receivedSwipe:)},
        //
        {uniMagCmdSendingNotification       , @selector(umCommand_starting:)},
        {uniMagCommandTimeoutNotification   , @selector(umCommand_timeout:)},
        {uniMagDidReceiveCmdNotification    , @selector(umCommand_receivedResponse:)},
        //
        {uniMagSystemMessageNotification    , @selector(umSystemMessage:)},
        
        {nil, nil},
    };
    
    //register or unregister
    for (int i=0; noteAndSel[i].s != nil ;i++) {
        if (reg)
            [nc addObserver:self selector:noteAndSel[i].s name:noteAndSel[i].n object:nil];
        else
            [nc removeObserver:self name:noteAndSel[i].n object:nil];
    }
}

-(void) umsdk_activate {
    
    //register observers for all uniMag notifications
	[self umsdk_registerObservers:TRUE];
    

	//enable info level NSLogs inside SDK
    // Here we turn on before initializing SDK object so the act of initializing is logged
    [uniMag enableLogging:TRUE];
    
    //initialize the SDK by creating a uniMag class object
    uniReader = [[uniMag alloc] init];
    
    /*
    //Set the reader type. The default is UniMag Pro.
    uniReader.readerType = ?;
    */
    
    /*
    //set SDK to perform the connect task automatically when headset is attached
    [uniReader setAutoConnect:TRUE]; 
	*/
    
    //set swipe timeout to infinite. By default, swipe task will timeout after 20 seconds
	[uniReader setSwipeTimeoutDuration:0];

    //make SDK maximize the volume automatically during connection
    [uniReader setAutoAdjustVolume:TRUE];
    
    //By default, the diagnostic wave file logged by the SDK is stored under the temp directory
    // Here it is set to be under the Documents folder in the app sandbox so the log can be accessed
    // through iTunes file sharing. See UIFileSharingEnabled in iOS doc.
    //[uniReader setWavePath: [NSHomeDirectory() stringByAppendingPathComponent: @"/Documents/audio.wav"]];
}

-(void) umsdk_deactivate {
    //deallocating the uniMag object deactivates the uniMag SDK
    [uniReader release];
    uniReader = nil;
    
    //it is the responsibility of SDK client to unregister itself as notification observer
    [self umsdk_registerObservers:FALSE];
}

//-----------------------------------------------------------------------------
#pragma mark - uniMag SDK notification handlers  -
//-----------------------------------------------------------------------------

#pragma mark attachment

//called when uniMag is physically attached
- (void)umDevice_attachment:(NSNotification *)notification {
    [self setAttachedLabelState:TRUE];
    self.btnConnect.enabled = TRUE;
    self.btnSendCommand.enabled = TRUE;
    
    [self dismissAllAlertViews];
	self.textResponse.text = @"";
	self.hexResponse.text = @"";
}

//called when uniMag is physically detached
- (void)umDevice_detachment:(NSNotification *)notification {
    [self setAttachedLabelState:FALSE];
    self.btnConnect.enabled = FALSE;
    self.btnSendCommand.enabled = FALSE;
    
    [self dismissAllAlertViews];
}

#pragma mark connection task

//called when attempting to start the connection task but iDevice's headphone playback volume is too low
- (void)umConnection_lowVolume:(NSNotification *)notification {
    [self showAlertView: @"Volume too low. Please maximize volume then re-attach UniMag."];
}

//called when attempting to start a task but iDevice's mono audio accessibility
// feature is enabled
- (void)umConnection_monoAudioError:(NSNotification *)notification {
    [self showAlertView: @"Mono audio setting is enabled. Please disable it from iOS's Settings app."];
}

//called when successfully starting the connection task
- (void)umConnection_starting:(NSNotification *)notification {
	[prompt_connecting show];
}

//called when SDK failed to handshake with reader in time. ie, the connection task has timed out
- (void)umConnection_timeout:(NSNotification *)notification {
	self.textResponse.text = [NSString stringWithFormat: @"Connection timedout in %.2fs", -self.connectionStartTime.timeIntervalSinceNow];
    self.connectionStartTime = nil;
	self.hexResponse.text = @"";
    
    [self showAlertView: @"Connecting with UniMag timed out. Please try again."];
}

//called when the connection task is successful. SDK's connection state changes to true
- (void)umConnection_connected:(NSNotification *)notification {
    self.btnSwipe.enabled = TRUE;
    
    [self dismissAllAlertViews];
	self.textResponse.text = [NSString stringWithFormat: @"Connected in %.2fs", -self.connectionStartTime.timeIntervalSinceNow];
    self.connectionStartTime = nil;
	self.hexResponse.text = @"";
    
    [self setConnectedLabelState:TRUE];
    
    #if 1==UMSDK_CUSTOMIZATION
    [uniReader requestSwipe];
    #endif
}

//called when SDK's connection state changes to false. This happens when reader becomes 
// physically detached or when a disconnect API is called
- (void)umConnection_disconnected:(NSNotification *)notification {
    [self dismissAllAlertViews];
    self.btnSwipe.enabled = FALSE;
    
    [self setConnectedLabelState:FALSE];
}

#pragma mark swipe task

//called when the swipe task is successfully starting, meaning the SDK starts to 
// wait for a swipe to be made
- (void)umSwipe_starting:(NSNotification *)notification {
    prompt_waitingForSwipe.message = @"Waiting for card swipe...";
    [prompt_waitingForSwipe show];

    return;
    
    prompt_waitingForSwipe.message = @"Waiting for card swipe...";
    [prompt_waitingForSwipe show];
}


//called when the SDK hasn't received a swipe from the device within a configured
// "swipe timeout interval".
- (void)umSwipe_timeout:(NSNotification *)notification {
    [self showAlertView: @"Waiting for swipe timed out. Please try again."];
}

//called when the SDK has read something from the uniMag device 
// (eg a swipe, a response to a command) and is in the process of decoding it
// Use this to provide an early feedback on the UI 
- (void)umDataProcessing:(NSNotification *)notification {
	self.textResponse.text = @"data processing...";
	self.hexResponse.text = @"";
}

//called when SDK failed to read a valid card swipe
- (void)umSwipe_invalid:(NSNotification *)notification {
    [self showAlertView: @"Failed to read a valid swipe. Please try again."];
    
	self.textResponse.text = @"";
	self.hexResponse.text = @"";
}

//called when SDK received a swipe successfully
- (void)umSwipe_receivedSwipe:(NSNotification *)notification {
    [self dismissAllAlertViews];
    
    NSData *data = [notification object];
    UMCardData *cd = [[[UMCardData alloc] initWithBytes:data] autorelease];
    
    //append general info
    NSMutableString *msg = [NSMutableString string];
    [msg appendFormat: @"%@\n", (cd.isValid ? @"+++++++VALID+++++++" : @"xxxxxxxINVALIDxxxxxxx")];

    if (NO == cd.isEncrypted) {
        [msg appendFormat: @"%@", repr(cd.byteData)];
        self.textResponse.text = msg;
        self.hexResponse.text = [data description];
        return;
    }
    
    //append plain text tracks
    NSData *tracks[3] = {cd.track1, cd.track2, cd.track3};
    for (int i=0; i<3; i++) {
        if (! tracks[i])
            continue;
        [msg appendFormat: @"Track %i:\n%@\n", i+1, repr(tracks[i])];
    }
    
    //append encrypted tracks
    if (cd.isValid && cd.isEncrypted) {
        NSData *tracks_enc[3] = {cd.track1_encrypted, cd.track2_encrypted, cd.track3_encrypted};
        for (int i=0; i<3; i++) {
            if (! tracks_enc[i])
                continue;
            [msg appendFormat: @"Encrypted Track %i:\n%@\n", i+1, [tracks_enc[i] description] ];
        }
    }
    
    //append serial number
    if (cd.serialNumber) {
        [msg appendFormat: @"Serial number: %@\n", [cd.serialNumber description] ];
    }
    
    //append KSN
    if (cd.KSN) {
        [msg appendFormat: @"KSN: %@\n", [cd.KSN description] ];
    }
    
    self.textResponse.text = msg;
	self.hexResponse.text = [data description];
}

#pragma mark command task

//called when SDK successfully starts to send a command. SDK starts the command
// task
- (void)umCommand_starting:(NSNotification *)notification {
}

//called when SDK failed to receive a command response within a configured
// "command timeout interval"
- (void)umCommand_timeout:(NSNotification *)notification {
    [self showAlertView: @"Waiting for command response timed out. Please try again."];
    self.textResponse.text = @"command timed out";
}

//called when SDK successfully received a response to a command
- (void)umCommand_receivedResponse:(NSNotification *)notification {
	NSData *data = [notification object];
	self.textResponse.text = repr(data);
	self.hexResponse.text = [data description];
}

#pragma mark misc

//this is a observer for a generic and extensible notification. It's currently only used during firmware update
- (void) umSystemMessage:(NSNotification *)notification {
	NSError *err = nil;
	err = [notification object];
	
	self.textResponse.text = [NSString stringWithFormat:
        @"%ld: %@", (long)[err code], [[err userInfo] valueForKey:NSLocalizedDescriptionKey]];
	self.hexResponse.text = @"";
}

//-----------------------------------------------------------------------------
#pragma mark - other ui chores -
//-----------------------------------------------------------------------------
-(void) dismissAllAlertViews {
	[prompt_connecting dismissWithClickedButtonIndex:-1 animated:FALSE];
	[prompt_waitingForSwipe dismissWithClickedButtonIndex:-1 animated:FALSE];
}

-(void) showAlertView:(NSString*)msg {
    [self dismissAllAlertViews];
    
    UIAlertView *alertView = [[UIAlertView alloc]
        initWithTitle:@"UniMag"
        message:msg
        delegate:nil
        cancelButtonTitle:@"Ok"
        otherButtonTitles:nil];
    [alertView show];
    [alertView release];
}

-(void) setConnectedLabelState:(BOOL)isConnected {
    if (isConnected) {
        self.connectedLabel.text = @"CONNECTED";
        self.connectedLabel.backgroundColor = 
            [UIColor colorWithRed:0 green:170/255.0 blue:78/255.0 alpha:1];
    } else {
        self.connectedLabel.text = @"DISCONNECTED";
        self.connectedLabel.backgroundColor = 
            [UIColor colorWithRed:170/255.0 green:170/255.0 blue:170/255.0 alpha:1.0];
    }
}

-(void) setAttachedLabelState:(BOOL)isAttached {
    if (isAttached) {
        self.attachedLabel.text = @"ATTACHED";
        self.attachedLabel.backgroundColor = 
            [UIColor colorWithRed:0 green:170/255.0 blue:78/255.0 alpha:1];
    } else {
        self.attachedLabel.text = @"DETACHED";
        self.attachedLabel.backgroundColor = 
            [UIColor colorWithRed:170/255.0 green:170/255.0 blue:170/255.0 alpha:1.0];
    }
}

-(void) displayUmRet:(NSString*) operation returnValue: (UmRet)ret {
    NSString *s;
    do {
        switch (ret) {
        case UMRET_SUCCESS          : s=@""; break;
        case UMRET_NO_READER        : s=@"No reader attached"; break;
        case UMRET_SDK_BUSY         : s=@"Communication with reader in progress"; break;
        case UMRET_MONO_AUDIO       : s=@"Mono audio enabled"; break;
        case UMRET_ALREADY_CONNECTED: s=@"Already connected"; break;
        case UMRET_LOW_VOLUME       : s=@"Low volume"; break;
        case UMRET_NOT_CONNECTED    : s=@"Not connected"; break;
        case UMRET_NOT_APPLICABLE   : s=@"Not applicable to reader type"; break;
        case UMRET_INVALID_ARG      : s=@"Invalid argument"; break;
        case UMRET_UF_INVALID_STR   : s=@"Invalid firmware update string"; break;
        case UMRET_UF_NO_FILE       : s=@"Firmware file not found"; break;
        case UMRET_UF_INVALID_FILE  : s=@"Invalid firmware file"; break;
        default: s=@"<unknown code>"; break;
        }
    } while (0);
    
    self.textResponse.text = [NSString stringWithFormat:
        @"%@ %@\n%@",
        operation, (UMRET_SUCCESS==ret?@"...":@"failed:"), s];
	self.hexResponse.text = @"";
}

//-----------------------------------------------------------------------------
#pragma mark - tab bar -
//-----------------------------------------------------------------------------
- (void)tabBarInit {
    //select first tab
    self.tabBar.selectedItem = [self.tabList_tbi objectAtIndex: 0];
    [self tabBar:self.tabBar didSelectItem: self.tabBar.selectedItem];
}
- (void)tabBar:(UITabBar *)tabBar didSelectItem:(UITabBarItem *)item {
    //nav bar title
    self.navigationItem.title = item.title;
    
    //clear vvRoot subviews
    for (UIView *sub in self.vvRoot.subviews)
        [sub removeFromSuperview];
    
    //get index and corresponding view
    NSUInteger tabIndex = [self.tabList_tbi indexOfObject: item];
    UIViewController *vc = [self.tabList_vc objectAtIndex: tabIndex];
    UIView *v = vc.view;
    
    //do special layout if selected help tab (the last tab)
    if (tabIndex == self.tabList_tbi.count-1) {
        //adjust width
        CGRect rectHelp = v.frame;
        rectHelp.size.width = self.vvRoot.frame.size.width;
        v.frame = rectHelp;
        
        //add help tab wrapped in a scroll view
        UIScrollView *scrollView =
            [[[UIScrollView alloc] initWithFrame: self.vvRoot.bounds] autorelease];
        [scrollView addSubview: v];
        scrollView.contentSize = v.frame.size;
        [self.vvRoot addSubview: scrollView];
    }
    //all other tabs
    else {
        //height of vHeader is vvRoot height minus v height
        CGFloat vHeaderHeight = self.vvRoot.frame.size.height - v.frame.size.height;
        
        //add header, at top inside vvRoot. Resize height
        CGRect rectH = self.vHeader.frame;
        rectH.size.height = vHeaderHeight;
        self.vHeader.frame = rectH;
        [self.vvRoot addSubview: self.vHeader];
        
        //add v, place at bottom inside vvRoot. No resize height
        CGRect rectV = v.frame;
        rectV.origin.y = vHeaderHeight;
        rectV.size.width = self.vvRoot.frame.size.width;
        v.frame = rectV;
        [self.vvRoot addSubview: v];
    }
}

//-----------------------------------------------------------------------------
#pragma mark - keyboard -
//-----------------------------------------------------------------------------

- (void)registerForKeyboardNotifications:(BOOL) reg {
    NSNotificationCenter *nc = [NSNotificationCenter defaultCenter];
    NSString *n1=UIKeyboardWillShowNotification;
    NSString *n2=UIKeyboardWillHideNotification;
    
    if (reg) {
        [nc addObserver:self selector:@selector(keyboardWillShow:)     name:n1 object:nil];
        [nc addObserver:self selector:@selector(keyboardWillBeHidden:) name:n2 object:nil];
    } else {
        [nc removeObserver:self name:n1 object:nil];
        [nc removeObserver:self name:n2 object:nil];
    }
}

- (void)keyboardWillShow:(NSNotification*)aNotification {
    NSDictionary* info = [aNotification userInfo];
    CGFloat kbH = [[info objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size.height;
    CGFloat tabBarH = self.tabBar.frame.size.height;
    UIEdgeInsets contentInsets = UIEdgeInsetsMake(0.0, 0.0, kbH-tabBarH, 0.0);
    self.svRoot.contentInset = contentInsets;
    self.svRoot.scrollIndicatorInsets = contentInsets;
    
    //scroll content into view
    CGRect rVisible = CGRectMake(0, self.vvRoot.frame.size.height, 1, 1);
    [self.svRoot scrollRectToVisible: rVisible animated:YES];
}

- (void)keyboardWillBeHidden:(NSNotification*)aNotification {
    self.svRoot.contentInset = UIEdgeInsetsZero;
    self.svRoot.scrollIndicatorInsets = UIEdgeInsetsZero;
}
@end

static NSString* repr(NSData* byteArray) {
    NSMutableString * ret = [NSMutableString string];
    
    @autoreleasepool
    {
        const int len = (int)byteArray.length;
        const Byte *bytes = byteArray.bytes;
        NSString *chr=nil;
        char oneCharStr[2] = {0,0};
        
        for (int i=0; i<len; i++)
        {
            //special escaped char
            if        (bytes[i] == '\t') {
                chr = @"\\t";
            } else if (bytes[i] == '\n') {
                chr = @"\\n";
            } else if (bytes[i] == '\r') {
                chr = @"\\r";
            } else if (bytes[i] == '\\') {
                chr = @"\\";
            } 
            //printable char
            else if (bytes[i] >= 0x20 && bytes[i] <= 0x7E) {
                oneCharStr[0] = bytes[i];
                chr = [NSString stringWithCString:oneCharStr encoding:NSASCIIStringEncoding];
            } 
            //normal escaped char eg 0xab => \xab
            else {
                chr = [NSString stringWithFormat:@"\\x%02x", bytes[i]];
            }
            
            //
            [ret appendString: chr];
        }
    }
    
    return ret;
}
