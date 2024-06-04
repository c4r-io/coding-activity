"use client"
import React, { Fragment } from 'react';

function LayoutComponent({
    isLeftSidebarOpen = false,
    isRightSidebarOpen = false,
    isHeaderOpen = true,
    isFooterOpen = true,
    children
}) {


    const headerContent = React.Children.toArray(children).find(child => child.type.displayName === 'LayoutComponent.Header');
    const footerContent = React.Children.toArray(children).find(child => child.type.displayName === 'LayoutComponent.Footer');
    const leftSidebarContent = React.Children.toArray(children).find(child => child.type.displayName === 'LayoutComponent.LeftSidebar');
    const rightSidebarContent = React.Children.toArray(children).find(child => child.type.displayName === 'LayoutComponent.RightSidebar');
    const mainContent = React.Children.toArray(children).find(child => child.type.displayName === 'LayoutComponent.Main');
    const shadow = "boxShadow";
    return (
        <div style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
        }}>
            {headerContent &&
                <header style={{
                    position: "absolute",
                    left: "0px",
                    right: "0px",
                    top: `${isHeaderOpen ? "0px" : "-50px"}`,
                    zIndex: 200,
                    height: "50px",
                    backdropFilter: "blur(10px)",
                    [shadow]: "0px 0px 10px 0px rgba(0,0,0,0.4)" 
                }}>
                    {headerContent}
                </header>
            }
            {leftSidebarContent &&
                <aside
                    style={{
                        position: "absolute",
                        left: `${isLeftSidebarOpen ? "0px" : "-260px"}`,
                        top: `${headerContent && isHeaderOpen ? "50px" : "0px"}`,
                        width: "260px",
                        // paddingTop: `${headerContent && isHeaderOpen ? "50px" : "0px"}`,
                        // paddingBottom: `${isFooterOpen ? "50px" : "0px"}`,
                        height: `calc(100vh - ${headerContent && isHeaderOpen ? "50px" : "0px"} - ${footerContent && isFooterOpen ? "50px" : "0px"} )`,
                        // height: "100vh",
                        zIndex: 100,
                        overflow: "auto",
                        [shadow]: "0px 0px 10px 0px rgba(0,0,0,0.4)" 

                    }}
                >
                    {leftSidebarContent}
                </aside>
            }
            {mainContent &&
                <main style={{
                    position: "absolute",
                    left: "0px",
                    right: "0px",
                    top: "0px",
                    width: "100%",
                    height: "100vh",
                    paddingTop: `${headerContent && isHeaderOpen ? "50px" : "0px"}`,
                    paddingBottom: `${footerContent && isFooterOpen ? "50px" : "0px"}`,
                    paddingLeft: `${leftSidebarContent && isLeftSidebarOpen ? "260px" : "0px"}`,
                    paddingRight: `${rightSidebarContent && isRightSidebarOpen ? "260px" : "0px"}`,
                    overflow: "hidden"
                }}>
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                            overflow: "auto"
                        }}
                    >
                        {mainContent}
                    </div>
                </main>
            }
            {rightSidebarContent &&
                <aside className="right-sidebar"
                    style={{
                        position: "absolute",
                        right: `${isRightSidebarOpen ? "0px" : "-260px"}`,
                        top: `${headerContent && isHeaderOpen ? "50px" : "0px"}`,
                        width: "260px",
                        // paddingTop: `${headerContent && isHeaderOpen ? "50px" : "0px"}`,
                        // paddingBottom: `${isFooterOpen ? "50px" : "0px"}`,
                        height: `calc(100vh - ${headerContent && isHeaderOpen ? "50px" : "0px"} - ${footerContent && isFooterOpen ? "50px" : "0px"} )`,
                        // height: "100vh",
                        zIndex: 100,
                        overflow: "auto",
                        [shadow]: "0px 0px 10px 0px rgba(0,0,0,0.4)" 
                    }}
                >
                    {rightSidebarContent}
                </aside>
            }
            {footerContent &&
                <footer style={{
                    position: "absolute",
                    left: "0px",
                    right: "0px",
                    bottom: `${isFooterOpen ? "0px" : "-50px"}`,
                    zIndex: 300,
                    height: "50px",
                    backdropFilter: "blur(10px)",
                    [shadow]: "0px 0px 10px 0px rgba(0,0,0,0.4)" 
                }}>
                    {footerContent}
                </footer>
            }
        </div>
    );
}

LayoutComponent.displayName = 'LayoutComponent';
export default LayoutComponent;

LayoutComponent.Header = ({ children }) => {
    return (
        <Fragment>
            {children}
        </Fragment>
    );
}
LayoutComponent.Header.displayName = 'LayoutComponent.Header';

LayoutComponent.Footer = ({ children }) => {
    return (
        <Fragment>
            {children}
        </Fragment>
    );
}

LayoutComponent.Footer.displayName = 'LayoutComponent.Footer';
LayoutComponent.LeftSidebar = ({ children }) => {
    return (
        <Fragment>
            {children}
        </Fragment>
    );
}

LayoutComponent.LeftSidebar.displayName = 'LayoutComponent.LeftSidebar';
LayoutComponent.RightSidebar = ({ children }) => {
    return (
        <Fragment>
            {children}
        </Fragment>
    );
}
LayoutComponent.RightSidebar.displayName = 'LayoutComponent.RightSidebar';
LayoutComponent.Main = ({ children }) => {
    return (
        <Fragment>
            {children}
        </Fragment>
    );
}
LayoutComponent.Main.displayName = 'LayoutComponent.Main';