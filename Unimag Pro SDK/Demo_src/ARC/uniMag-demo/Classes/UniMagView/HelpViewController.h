@class HelpViewController;

#import <UIKit/UIKit.h>
#import "UniMagViewController.h"

@interface HelpViewController : UIViewController

-(void) refreshLogFileCount;

@property (assign/*weak reference*/, nonatomic) IBOutlet UniMagViewController *umVc;
@property (retain, nonatomic) IBOutlet UILabel *lbLogCount;
@property (retain, nonatomic) IBOutlet UIButton *btnEmail;
- (IBAction)emailLog;
- (IBAction)changeLogEnable:(id)sender;

@end
