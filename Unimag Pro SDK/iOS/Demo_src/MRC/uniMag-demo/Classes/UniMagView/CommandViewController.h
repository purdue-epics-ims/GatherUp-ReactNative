@class CommandViewController;

#import <UIKit/UIKit.h>
#import "UniMagViewController.h"

//command list
typedef  struct {
    NSString *name;
    SEL api;
    id arg;
} UmSdkCmdList_t;

@interface CommandViewController : UIViewController

//command list
-(UmSdkCmdList_t) getCmdListEntry:(int) i;
-(int) getCmdListLen;

-(IBAction) sendCommand;
@property (assign/*weak reference*/, nonatomic) IBOutlet UniMagViewController *umVc;
@property (retain, nonatomic) IBOutlet UIPickerView *cmdPicker;

@end
