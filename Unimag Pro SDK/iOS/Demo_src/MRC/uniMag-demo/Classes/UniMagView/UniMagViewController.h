
/*
This example app shows how to set up a project to use the UniMag SDK

================================================================================
Project setup:
- Add UniMag static library and header (IDTECH_UniMag.a, uniMag.h) to project
- Add AVFoundation, AudioToolbox, MediaPlayer framework to project

================================================================================
SDK initialization:
- Register NSNotification observers for all notifications listed in the uniMag class header
- Instantiate an uniMag object ie. [[uniMag alloc] init], this makes the SDK active.
- After that the SDK will start firing notifications, for example,
  uniMagAttachmentNotification

================================================================================
Reading card swipe:
- SDK's state must be `connected` before it will read swipes. See the below 
  section titled 'Connecting with reader'
- Call [uniReader requestSwipe] to make the SDK begin waiting for a swipe. When a
  swipe is made, a uniMagDidReceiveDataNotification with the card data will be fired
- To stop the SDK waiting before a swipe is made, call [uniReader cancelTask]

================================================================================
Connecting with reader:
- SDK's state changes to `connected` after it has successfully performed 
  a `connection` task with the UniMag device
- To start the connection task, call [uniReader startUniMag:TRUE]. When it is
  successfully finished, uniMagDidConnectNotification will fire, and 
  [uniReader getConnectionStatus] will become TRUE


For more information, please refer to the SDK manual.
*/


@class UniMagViewController;

#import <UIKit/UIKit.h>
#import "uniMag.h"

@interface UniMagViewController : UIViewController
    <UITabBarDelegate>
{
	uniMag *uniReader;
}

//Exposed
@property (readonly, nonatomic) uniMag *uniReader;
-(void) displayUmRet:(NSString*) operation returnValue: (UmRet)ret;
-(void) tabBarInit;

//Actions
- (IBAction)connectReader;
- (IBAction)swipeCard;

//Outlets
// root
@property (retain, nonatomic) IBOutlet UIScrollView *svRoot;
@property (retain, nonatomic) IBOutlet UIView *vvRoot;
// header view
@property (retain, nonatomic) IBOutlet UIView *vHeader;
@property (retain, nonatomic) IBOutlet UITextView *textResponse;
@property (retain, nonatomic) IBOutlet UITextView *hexResponse;
// reader tab
@property (assign, nonatomic) IBOutlet UIViewController *subvcThatNeedsViewWillAppearEvent;
@property (retain, nonatomic) IBOutlet UILabel *attachedLabel;
@property (retain, nonatomic) IBOutlet UILabel *connectedLabel;
@property (retain, nonatomic) IBOutlet UIButton *btnConnect;
// swipe tab
@property (retain, nonatomic) IBOutlet UIButton *btnSwipe;
// send command tab
@property (retain, nonatomic) IBOutlet UIButton *btnSendCommand;
// help tab
// tab bar
@property (retain, nonatomic) IBOutlet UITabBar *tabBar;
// these two parallel arrays are used to map between tab bar button and the corresponding view controller
@property (retain, nonatomic) IBOutletCollection(UITabBarItem) NSArray *tabList_tbi;
@property (retain, nonatomic) IBOutletCollection(UIViewController) NSArray *tabList_vc;

@end
