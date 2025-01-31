import { render, screen } from "@testing-library/react";
import AvatarImage from "./AvatarImage";

describe("AvatarImage Component", () => {
  test("renders the Avatar component with default UserOutlined icon", () => {
    render(<AvatarImage />);
    
    // Check if the default UserOutlined icon is inside the Avatar
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  test("renders an Avatar with a provided image source", () => {
    const imageUrl = "/uploads/avatar.png";
    render(<AvatarImage src={imageUrl} />);
    
    // Check if Avatar has the correct `src`
    const avatarImage = screen.getByRole("img") as HTMLImageElement;
    expect(avatarImage.src).toContain(imageUrl);
  });

  test("applies custom size when passed", () => {
    render(<AvatarImage size={64} />);
    
    // Check if the custom `size` prop is applied
    const avatar = screen.getByRole("img").parentElement;
    expect(avatar).toHaveStyle({ width: "64px", height: "64px" });
  });
});
