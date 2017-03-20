@class ReaderViewController;

#import <UIKit/UIKit.h>
#import "UniMagViewController.h"

@interface ReaderViewController : UIViewController

@property (assign/*weak reference*/, nonatomic) IBOutlet UniMagViewController *umVc;
@property (retain, nonatomic) IBOutlet UILabel *lbReaderType;

- (IBAction)selectReaderType:(id)sender;

@end
