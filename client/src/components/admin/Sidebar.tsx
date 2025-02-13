import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import SidebarItem from "./SidebarItem";
import { BiCategory, BiCog, BiPackage, BiUser } from "react-icons/bi";
import Link from "next/link";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen transition-all duration-300 p-4 border-r border-border ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1
            className={`${
              sidebarOpen ? "block" : "hidden"
            } text-xl font-bold text-foreground`}
          >
            Admin Panel
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-secondary"
          >
            <FiMenu className="text-foreground" />
          </button>
        </div>
        <nav>
          <Link href="/administrator/products">
            <SidebarItem
              icon={<BiPackage />}
              text="Products"
              active={true}
              expanded={sidebarOpen}
            />
          </Link>
          <SidebarItem
            icon={<BiCategory />}
            text="Categories"
            active={false}
            expanded={sidebarOpen}
          />
          <SidebarItem
            icon={<BiUser />}
            text="Customers"
            active={false}
            expanded={sidebarOpen}
          />
          <SidebarItem
            icon={<BiCog />}
            text="Settings"
            active={false}
            expanded={sidebarOpen}
          />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
