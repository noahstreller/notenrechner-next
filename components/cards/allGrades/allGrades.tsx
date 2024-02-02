"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import Grade from "@/lib/entities/grade";
import { columns } from "./columns";
import useTranslation from "next-translate/useTranslation";

export function AllGrades({ data, setData, refresh }: { data: Grade[], setData: Function, refresh: Function}) {
    const { t, lang } = useTranslation('common');

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Grades</CardTitle>
                <CardDescription>All recent grades are listed here</CardDescription>

            </CardHeader>
            <CardContent>
                <Button onClick={() => {new Grade(Math.random() + 3.5, "PE"); refresh();}}>{t("grades.add")}</Button>
                <DataTable columns={columns()} data={data} /> 
            </CardContent>
        </Card>
    )
}