import "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SubMenu = ({ items }) => {
    return items.map((item) => (
        <Link key={item.text} to={item.link} className="block px-4 py-2 text-gray-800 hover:bg-blue-100" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {item.text}
        </Link>
    ));
};

SubMenu.propTypes = {
    items: PropTypes.array.isRequired,
};

export default SubMenu;
