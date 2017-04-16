#import "CommandViewController.h"

@interface CommandViewController () <UIPickerViewDelegate> {
}
@end

@implementation CommandViewController
@synthesize umVc=_umVc;
@synthesize cmdPicker = _cmdPicker;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
    }
    return self;
}

- (IBAction) sendCommand {
    //looks up a 'sendCommand...' API to call from a table
    NSInteger selectedCommand = [self.cmdPicker selectedRowInComponent:0];
    if (selectedCommand <  0 || selectedCommand >= [self getCmdListLen])
        return;
    UmSdkCmdList_t c = [self getCmdListEntry: (int)selectedCommand];
    
    //call the api
	UmRet ret = (UmRet)[self.umVc.uniReader performSelector:c.api withObject:(id)c.arg];
    [self.umVc displayUmRet: @"Starting send command" returnValue: ret];
}

//-----------------------------------------------------------------------------
#pragma mark - select reader type UIActionSheet -
//-----------------------------------------------------------------------------

//a lookup table of SDK's 'sendCommand...' APIs, along with their display name and any argument
-(UmSdkCmdList_t) getCmdListEntry:(int) i {
    UmSdkCmdList_t umsdk_commandList[] = {
        {@"Get version"              ,@selector(sendCommandGetVersion)             ,nil},
        {@"Get settings"             ,@selector(sendCommandGetSettings)            ,nil},
        {@"Get serial #"             ,@selector(sendCommandGetSerialNumber)        ,nil},
    };
    return umsdk_commandList[i];
}

-(int) getCmdListLen {
    return 3;
}

- (NSInteger) numberOfComponentsInPickerView:(UIPickerView *)pickerView{
	return 1;
}

- (NSInteger) pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component{
	return [self getCmdListLen];
}

- (UIView *)pickerView:(UIPickerView *)pickerView viewForRow:(NSInteger)row 
    forComponent:(NSInteger)component reusingView:(UIView *)view {
    //get or create label
    UILabel * label = (UILabel *)view;
    if (nil == label) {
        CGRect frame = CGRectMake(0.0, 0.0, pickerView.frame.size.width-50, 50);
        label = [[[UILabel alloc] initWithFrame:frame] autorelease];
        label.adjustsFontSizeToFitWidth = TRUE;
        label.backgroundColor = [UIColor colorWithWhite:0 alpha:0];
        label.font = [UIFont boldSystemFontOfSize:18];
    }
    
    label.text = [self getCmdListEntry: (int)row].name;
    return label;
}

- (void)dealloc {
    [_cmdPicker release];
    [super dealloc];
}
@end
