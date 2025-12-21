import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { Helmet } from "react-helmet";

interface PageProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, title = "", ...rest }, ref) => {
    return (
      <div ref={ref} {...rest}>
        <Helmet>
          <title>{title} | InstagramReact</title>
        </Helmet>
        {children}
      </div>
    );
  }
);

Page.displayName = "Page";

export default Page;
