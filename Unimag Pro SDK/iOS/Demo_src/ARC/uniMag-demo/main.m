
#import <UIKit/UIKit.h>

int main(int argc, char *argv[]) {
    
    int retVal = 0;
    //NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];
    @autoreleasepool {
    retVal = UIApplicationMain(argc, argv, nil, nil);
	
    //[pool release];
	}
    return retVal;
}
