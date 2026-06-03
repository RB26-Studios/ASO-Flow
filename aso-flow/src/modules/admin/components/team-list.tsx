"use client"

import { TeamMemberData } from "../services/teamService"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Badge } from "@/src/components/ui/badge"

interface TeamListProps {
  members: TeamMemberData[]
}

export function TeamList({ members }: TeamListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-zinc-50 text-muted-foreground">
        Nenhum membro na equipe ainda.
      </div>
    )
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-50">
          <TableRow>
            <TableHead>Membro</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Função</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {member.full_name ? member.full_name.substring(0, 2).toUpperCase() : "US"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{member.full_name}</span>
              </TableCell>
              <TableCell>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${member.status ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {member.status ? 'Ativo' : 'Inativo'}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={member.role === "ADMIN" ? "default" : "secondary"}>
                  {member.role}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
