#import "CommandViewController.h"

#ifndef SuppressPerformSelectorLeakWarning
#define SuppressPerformSelectorLeakWarning(Stuff) \
    do { \
        _Pragma("clang diagnostic push") \
        _Pragma("clang diagnostic ignored \"-Warc-performSelector-leaks\"") \
        Stuff; \
        _Pragma("clang diagnostic pop") \
    } while (0)
#endif


@implementation UmCmdList_t
@synthesize name=_name;
@synthesize api = _api;
@synthesize arg = _arg;

-(id) init {
    self = [super init];
    if (self) {
        _name = @"";
        _api = nil;
        _arg = nil;
    }
    return self;
}

-(void) setV: (NSString *) _n : (SEL) _ai : (id) _ag
{
    _name = _n;
    _api = _ai;
    _arg = _ag;
}
@end

//static NSArray *s_cmd_list = nil;

@interface CommandViewController () <UIPickerViewDelegate> {
}
@end

@implementation CommandViewController
@synthesize umVc=_umVc;
@synthesize cmdPicker = _cmdPicker;
@synthesize s_cmd_list=_s_cmd_list;

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
    UmCmdList_t * c = [self getCmdListEntry: (int)selectedCommand];
    //call the api
    if (c.api) {
        //UmRet ret = (UmRet)[self.umVc.uniReader performSelector : c.api  withObject: c.arg];
        //[self.umVc displayUmRet: @"Starting send command" returnValue: ret];

        
        UmRet ret;
        SuppressPerformSelectorLeakWarning(ret = (UmRet)[self.umVc.uniReader performSelector : c.api  withObject: c.arg]);
        [self.umVc displayUmRet: @"Starting send command" returnValue: ret];
        

    }
}

//-----------------------------------------------------------------------------
#pragma mark - select reader type UIActionSheet -
//-----------------------------------------------------------------------------

-(void) initListData{
    if (nil == s_cmd_list) {
        s_cmd_list = [[NSMutableArray alloc] init];
        //NSAutoreleasePool* pool=[[NSAutoreleasePool alloc] init];
        UmCmdList_t * cd1 = [UmCmdList_t alloc];
        UmCmdList_t * cd2 = [UmCmdList_t alloc];
        UmCmdList_t * cd3 = [UmCmdList_t alloc];
        [cd1 setV: @"Get version" : @selector(sendCommandGetVersion) : nil];
        [cd2 setV: @"Get settings" : @selector(sendCommandGetSettings) : nil];
        [cd3 setV: @"Get serial #" : @selector(sendCommandGetSerialNumber) : nil];
        [s_cmd_list addObject: cd1];
        [s_cmd_list addObject: cd2];
        [s_cmd_list addObject: cd3];
        //[pool drain];
    }
}

//a lookup table of SDK's 'sendCommand...' APIs, along with their display name and any argument
-(UmCmdList_t * ) getCmdListEntry:(int) i {
    [self initListData];
    /*
    UmSdkCmdList_t umsdk_commandList[] = {
        {@"Get version"              ,@selector(sendCommandGetVersion)             ,nil},
        {@"Get settings"             ,@selector(sendCommandGetSettings)            ,nil},
        {@"Get serial #"             ,@selector(sendCommandGetSerialNumber)        ,nil},
    };
    */
    
    return [s_cmd_list objectAtIndex:i]; 
}

-(int) getCmdListLen {
    //int ict = (int)[s_cmd_list count];
    //NSLog(@"%d", ict);
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
        label = [[UILabel alloc] initWithFrame:frame];
        label.adjustsFontSizeToFitWidth = TRUE;
        label.backgroundColor = [UIColor colorWithWhite:0 alpha:0];
        label.font = [UIFont boldSystemFontOfSize:18];
    }
    
    label.text = [self getCmdListEntry: (int)row].name;
    return label;
}

/*
- (void)dealloc {
    [s_cmd_list removeAllObjects];
    [_cmdPicker release];
    [super dealloc];
}
*/
@end
