import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import StateMessage from "../components/StateMessage.jsx";

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" breadcrumb={<Link to="/">← Repositories</Link>} />
      <div className="page-body">
        <StateMessage type="empty" title="404" text="This page does not exist." />
      </div>
    </>
  );
}
