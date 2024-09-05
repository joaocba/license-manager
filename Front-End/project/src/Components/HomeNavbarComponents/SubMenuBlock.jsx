import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import SubMenu from "./SubMenuItem";

const SubMenuBlock = ({ isSubMenuOpen, subMenuItems, isSidebar, submenuRef, closeSidebar }) => {
    const [submenuHeight, setSubmenuHeight] = useState(0);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [fadeEffect, setFadeEffect] = useState(false);
    const [pendingCategory, setPendingCategory] = useState(null);

    // Set the height of the submenu block based on the number of items
    useEffect(() => {
        if (isSubMenuOpen && submenuRef.current) {
            setSubmenuHeight(submenuRef.current.scrollHeight);
        } else {
            setSubmenuHeight(0);
        }
    }, [isSubMenuOpen, submenuRef]);

    useEffect(() => {
        if (subMenuItems && subMenuItems.length > 0 && !currentCategory) {
            setCurrentCategory(subMenuItems[0].category);
        }
    }, [subMenuItems, currentCategory]);

    // Handle category hover effect
    const handleCategoryHover = (category) => {
        if (category !== currentCategory) {
            setPendingCategory(category);
            setFadeEffect(true);
        }
    };

    useEffect(() => {
        if (fadeEffect) {
            const timer = setTimeout(() => {
                setCurrentCategory(pendingCategory);
                setFadeEffect(false);
            }, 300); // Duration of the fade out effect

            return () => clearTimeout(timer);
        }
    }, [fadeEffect, pendingCategory]);

    return (
        <>
            {!isSidebar && (
                <div ref={submenuRef} className={`nav-shadow-lg submenu-block ${isSubMenuOpen ? "submenu-open" : "submenu-closed"}`}>
                    <div className="flex items-start justify-center submenu-content">
                        <div className="flex-auto w-1/6 p-4 submenu-category-shadow-r">
                            <h3 className="mb-4 text-lg font-semibold">Our Products</h3>
                            <ul className="space-y-2">
                                {subMenuItems.map((item, index) => (
                                    <li key={index} className={`cursor-pointer flex justify-between items-center px-2 py-1 rounded-md transition-colors ${currentCategory === item.category ? "text-blue-500 font-semibold bg-blue-100" : "hover:text-blue-500 hover:bg-blue-50"}`} onMouseEnter={() => handleCategoryHover(item.category)}>
                                        <span>{item.category}</span>
                                        {currentCategory === item.category && (
                                            <svg className="w-4 h-4 ml-2 text-blue-500 transform rotate-90 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414L9.586 4.293a1 1 0 011.414 0l4.293 4.293a1 1 0 01-1.414 1.414L10 6.414 6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-auto w-1/3 px-12 py-4 transition-opacity duration-300 ease-in-out border-r border-gray-200" style={{ opacity: fadeEffect ? 0 : 1 }}>
                            {currentCategory && (
                                <div>
                                    <div className="flex items-center justify-between pb-4 mb-4 border-b">
                                        <h3 className="text-lg font-semibold">{currentCategory}</h3>
                                        <Link to={`/products/${currentCategory.toLowerCase().replace(/ /g, "-")}`} className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600">
                                            Learn more
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {subMenuItems
                                            .find((item) => item.category === currentCategory)
                                            ?.features.map((feature, index) => (
                                                <div key={index} className="font-semibold submenu-feature-item">
                                                    <h4 className="mb-2 font-semibold">{feature.title}</h4>
                                                    <p className="text-sm text-gray-700">{feature.description}</p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex-auto w-1/6 p-4 transition-opacity duration-300 ease-in-out" style={{ opacity: fadeEffect ? 0 : 1 }}>
                            {currentCategory && (
                                <div>
                                    <img src={subMenuItems.find((item) => item.category === currentCategory)?.image} alt="Product Descriptive Image" className="mb-4" />
                                    <p className="text-sm text-gray-700">{subMenuItems.find((item) => item.category === currentCategory)?.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {isSidebar && (
                <div ref={submenuRef} className={`overflow-hidden transition-all duration-300 ease-in-out ${isSidebar ? "ml-4" : "absolute left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg"}`} style={{ height: `${submenuHeight}px` }}>
                    <div className={`${isSidebar ? "" : "p-2"}`}>
                        <SubMenu items={subMenuItems} isSidebar={isSidebar} closeSidebar={closeSidebar} />
                    </div>
                </div>
            )}
        </>
    );
};

SubMenuBlock.propTypes = {
    isSubMenuOpen: PropTypes.bool.isRequired,
    subMenuItems: PropTypes.array.isRequired,
    isSidebar: PropTypes.bool,
    submenuRef: PropTypes.object,
    closeSidebar: PropTypes.func,
};

export default SubMenuBlock;
