
#import "AboutScreenViewController.h"

@implementation AboutScreenViewController

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void)dealloc {
    //[super dealloc];
}

- (void)viewDidLoad {
    [super viewDidLoad];
	
	//set up nav bar title
    CFStringRef cfsVer = (CFStringRef)CFBundleGetValueForInfoDictionaryKey(CFBundleGetMainBundle(), kCFBundleVersionKey);
    self.navigationItem.title = [NSString stringWithFormat:@"UniMag %@", (__bridge   NSString *)cfsVer];
}

@end
