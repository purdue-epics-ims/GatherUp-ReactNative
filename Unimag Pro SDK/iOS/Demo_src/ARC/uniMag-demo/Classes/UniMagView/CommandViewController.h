@class CommandViewController;

#import <UIKit/UIKit.h>
#import "UniMagViewController.h"

/*
//command list
typedef  struct {
    NSString *name;
    SEL api;
    id arg;
} UmSdkCmdList_t;
*/


@interface UmCmdList_t : NSObject

//Raw data
@property (nonatomic, strong) NSString *name;

//Meta
@property (nonatomic, assign) SEL api;
@property (nonatomic, strong) id arg;

-(void) setV: (NSString *) _n : (SEL) _ai : (id) _ag;
@end


@interface CommandViewController : UIViewController{
    NSMutableArray *s_cmd_list;
}
@property (retain, nonatomic) NSMutableArray *s_cmd_list;

//command list
-(UmCmdList_t *) getCmdListEntry:(int) i;
-(int) getCmdListLen;
-(void) initListData;

-(IBAction) sendCommand;
@property (assign/*weak reference*/, nonatomic) IBOutlet UniMagViewController *umVc;
@property (retain, nonatomic) IBOutlet UIPickerView *cmdPicker;

@end
