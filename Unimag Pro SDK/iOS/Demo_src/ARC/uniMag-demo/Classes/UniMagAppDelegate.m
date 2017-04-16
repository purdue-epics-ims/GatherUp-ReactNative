
#import "UniMagAppDelegate.h"

@implementation UniMagAppDelegate

@synthesize window=_window;
@synthesize navigationController=_navigationController;


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Add the navigation controller's view to the window and display.
    [self.window addSubview:self.navigationController.view];
        
    [self.window makeKeyAndVisible];
    
    return YES;
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
}

- (void)applicationWillResignActive:(UIApplication *)application {
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
}

//- (void)dealloc {
	//[_navigationController release];
	//[_window release];
	
	//[super dealloc];
//}

@end
