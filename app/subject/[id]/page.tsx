"use client";

import { CardSkeleton } from "@/components/cards/card-skeleton";
import { GradeOverviewForSubject } from "@/components/cards/grade-overview";
import { GradesForSubject } from "@/components/cards/gradesForSubject/gradesForSubject";
import { RequiredGradesForSubject } from "@/components/cards/required-grades";
import { usePreferences } from "@/components/preferences-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardBoard } from "@/components/ui/cardboard";
import { DetailRow, DetailRowBoolean } from "@/components/ui/detail-row";
import { GradeWithSubject, Subject } from "@/db/schema";
import { useDevice } from "@/lib/hooks/useMediaQuery";
import { catchProblem } from "@/lib/problem";
import {
  getGradeAverageBySubject,
  getGradesBySubjectWithSubject,
} from "@/lib/services/grade-service";
import { doesGradePass } from "@/lib/services/notAsyncLogic";
import { getSubjectById } from "@/lib/services/subject-service";
import { truncateText } from "@/lib/utils";
import { Average } from "@/types/types";
import { Bird, HomeIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SubjectPage({ params }: { params: { id: string } }) {
  return <SubjectDetails subjectId={params.id} />;
}

function SubjectDetails({ subjectId }: { subjectId: string }) {
  const session = useSession();
  const router = useRouter();
  const { isMobile, isTablet, isDesktop } = useDevice();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [grades, setGrades] = useState<GradeWithSubject[]>([]);
  const [average, setAverage] = useState<Average | null>(null);
  const [dataState, setDataState] = useState<"loading" | "loaded" | "notfound">(
    "loading"
  );
  const userPreferences = usePreferences();

  const fetchData = async () => {
    try {
      const id = Number(subjectId);
      const subject = catchProblem(await getSubjectById(id));
      const newGrades = catchProblem(
        await getGradesBySubjectWithSubject(subject)
      );
      const newAverage = catchProblem(await getGradeAverageBySubject(subject));
      if (subject) {
        setSubject(subject);
        setGrades([...newGrades]);
        setAverage(newAverage);
        setDataState("loaded");
      } else {
        setDataState("notfound");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setDataState("loading");
    const fetchData = async () => {
      try {
        const id = Number(subjectId);
        const subject = catchProblem(await getSubjectById(id));
        const newGrades = catchProblem(
          await getGradesBySubjectWithSubject(subject)
        );
        const newAverage = catchProblem(
          await getGradeAverageBySubject(subject)
        );
        console.log("newAverage", newAverage);
        if (subject) {
          setSubject(subject);
          setGrades([...newGrades]);
          setAverage(newAverage);
          setDataState("loaded");
        } else {
          setDataState("notfound");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [subjectId, router, session]);

  if (session.status === "unauthenticated") return <>Log in first lil bro</>;
  if (dataState === "notfound")
    return (
      <div>
        <Alert>
          <Bird className="h-4 w-4" />
          <AlertTitle className="font-bold">Woops.</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <>We cannot find the subject you are looking for.</>
            <Button variant={"outline"} asChild>
              <Link
                href={"/"}
                className="flex flex-row gap-2 justify-center items-center"
              >
                <HomeIcon className="size-4 text-muted-foreground" />
                Return home
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  if (
    session.status === "loading" ||
    dataState === "loading" ||
    !subject ||
    !grades ||
    !average ||
    (!isMobile && !isTablet && !isDesktop)
  )
    return (
      <>
        <CardBoard className="flex xl:hidden">
          <CardSkeleton wide variant="medium" />
          <CardSkeleton wide variant="large" />
          <CardSkeleton wide variant="small" />
          <CardSkeleton wide variant="small" />
        </CardBoard>
        <CardBoard row className="hidden xl:flex">
          <CardBoard>
            <CardSkeleton variant="small" />
            <CardSkeleton variant="small" />
            <CardSkeleton variant="medium" />
          </CardBoard>
          <CardBoard>
            <CardSkeleton variant="medium" />
            <CardSkeleton variant="medium" />
          </CardBoard>
          <CardBoard>
            <CardSkeleton variant="large" />
            <CardSkeleton variant="medium" />
          </CardBoard>
        </CardBoard>
      </>
    );
  if (session.status === "authenticated")
    return (
      dataState === "loaded" && (
        <CardBoard row={isDesktop}>
          {subject ? (
            <>
              <CardBoard>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {truncateText(subject.name!, 20).text}
                    </CardTitle>
                    <CardDescription>Subject details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DetailRow title="ID" value={subject.id} />
                    <DetailRow
                      title="Name"
                      value={truncateText(subject.name!, 40).text}
                    />
                    <DetailRowBoolean
                      variant="yes-no"
                      title="Passing"
                      value={doesGradePass(
                        average.gradeAverage!,
                        userPreferences.preferences!
                      )}
                    />
                    <DetailRow
                      title="Grade count"
                      value={average.gradeAmount}
                    />
                    <DetailRow
                      title="Grade count (weights considered)"
                      value={average.gradeWeightedAmount}
                    />
                    <DetailRow title="Grade sum" value={average.gradeSum} />
                    <DetailRow
                      title="Grade sum (weights considered)"
                      value={average.gradeWeightedSum}
                    />
                  </CardContent>
                </Card>
                <GradesForSubject
                  data={grades}
                  setData={setGrades}
                  refresh={fetchData}
                  subject={subject}
                />
              </CardBoard>
              {average && (
                <>
                  <GradeOverviewForSubject
                    data={grades}
                    averageData={average}
                  />
                  <RequiredGradesForSubject
                    subject={subject}
                    averageData={average}
                  />
                </>
              )}
            </>
          ) : (
            <div>Subject not found</div>
          )}
        </CardBoard>
      )
    );
}
