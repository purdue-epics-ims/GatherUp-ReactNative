#import "ReaderViewController.h"
#import "uniMag.h"

@interface ReaderViewController() <UIActionSheetDelegate>
@end

@implementation ReaderViewController
@synthesize umVc=_umVc;
@synthesize lbReaderType = _lbReaderType;

//-----------------------------------------------------------------------------
#pragma mark - life cycle -
//-----------------------------------------------------------------------------
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
    }
    return self;
}

/*
- (void)dealloc {
    [_lbReaderType release];
    [super dealloc];
}
*/

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    [self refreshReaderTypeLabel];
}

- (void)refreshReaderTypeLabel {
    self.lbReaderType.text = UmReader_lookup(self.umVc.uniReader.readerType);
}

//-----------------------------------------------------------------------------
#pragma mark - select reader type UIActionSheet -
//-----------------------------------------------------------------------------
static const UmReader UmReaderTable[] = {
//    UMREADER_UNIMAG_ORIGINAL, //not showing the legacy UniMag (original)
    UMREADER_UNIMAG_PRO,
    UMREADER_UNIMAG_II,
    UMREADER_SHUTTLE,
};
static const int UmReaderTableLen = sizeof(UmReaderTable)/sizeof(UmReader);

- (IBAction)selectReaderType:(id)sender {
    UIActionSheet *uas = [[UIActionSheet alloc]
        initWithTitle: @"Select reader type" delegate: self 
        cancelButtonTitle: nil destructiveButtonTitle: nil
        otherButtonTitles: nil];
    
    //populate from list. From first to last.
    // This way, the button index will coincide with the entry's list index
    for (int i=0; i<UmReaderTableLen; i++)
        [uas addButtonWithTitle: UmReader_lookup(UmReaderTable[i]) ];
    
    //last button is the cancel button
    [uas addButtonWithTitle: @"Cancel"];
    uas.cancelButtonIndex = UmReaderTableLen;
    
    [uas showFromTabBar: self.umVc.tabBar];
}

- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {
    //ignore cancel button
    if (buttonIndex == UmReaderTableLen)
        return;
    
    UmReader readerType = UmReaderTable[buttonIndex];
    self.umVc.uniReader.readerType = readerType;
    [self refreshReaderTypeLabel];
}
@end
