import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { TableRow, TableCell } from "@/components/ui/table";
import { type User } from "@/types/user";
import { Doc } from "../../../convex/_generated/dataModel";
import { DocumentMenu } from "./document-meun";
import { SiGoogledocs } from "react-icons/si";
import { Building2Icon, CircleUserIcon } from "lucide-react";

interface DocumentRowProps {
  document: Doc<"documents">;
  user?: User;
}

export const DocumentRow = ({ document, user }: DocumentRowProps) => {
  const router = useRouter();

  return (
    <TableRow
      className="cursor-pointer"
      onClick={() => router.push(`/documents/${document._id}`)}
    >
      <TableCell className="w-[50px]">
        <SiGoogledocs className="size-6 fill-blue-500" />
      </TableCell>
      <TableCell className="font-medium md:w-[40%]">{document.title}</TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        <div className="flex justify-left items-center gap-2">
          {user?.avatar && (
            <img
              alt={user.name}
              src={user.avatar}
              className="size-5 rounded-full"
            />
          )}
          {user?.name ?? "Unknown"}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:flex items-center gap-2">
        {document.organizationId ? (
          <Building2Icon className="size-4" />
        ) : (
          <CircleUserIcon className="size-4" />
        )}
        {document.organizationId ? "Organization" : "Personal"}
      </TableCell>
      <TableCell className="text-muted-foreground hidden md:table-cell">
        {format(new Date(document._creationTime), "MMM dd, yyyy")}
      </TableCell>
      <TableCell className="flex justify-end">
        <DocumentMenu
          documentId={document._id}
          title={document.title}
          onNewTab={() => window.open(`/documents/${document._id}`, "_blank")}
        />
      </TableCell>
    </TableRow>
  );
};
