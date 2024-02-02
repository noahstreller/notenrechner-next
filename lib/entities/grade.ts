import appGlobals from "../app.globals";
import GradeDTO from "./dtos/gradeDTO";
import GradeInfo from "./gradeInfo";

export default class Grade {
    static grades: Grade[] = [];
    private id: number;
    private value: number;
    private subject: string;
    private weight: number;
    private date: Date;

    constructor(value: number, subject: string, weight: number = 1, date: Date = new Date()){
        this.id = Grade.grades.length + 1;
        this.value = value;
        this.subject = subject;
        this.weight = weight;
        this.date = date;
        if(Grade.validate(this)){
            Grade.grades.push(this);
        }
    }

    static validate(grade: Grade): boolean {
        if (grade.value < appGlobals.minimumGrade || grade.value > appGlobals.maximumGrade) {
            throw new Error('Invalid grade value');
        }
        if (grade.weight < 0) {
            throw new Error('Invalid grade weight');
        }
        if (grade.subject === "") {
            throw new Error('Invalid grade subject');
        }
        return true;
    }

    static get(): Grade[] {
        return this.grades;
    }

    getValue(): number {
        return this.value;
    }

    static getById(id: number): Grade {
        let result = this.grades.find(grade => grade.id === id);
        if (result) {
            return result;
        } else {
            throw new Error('Grade not found');
        }
    }

    static getBySubject(subject: string): Grade[] {
        let result = this.grades.filter(grade => grade.subject === subject);
        if (result) {
            return result;
        } else {
            throw new Error('No matching Grade was found');
        }
    }

    static deleteById(id: number): void {
        let index = this.grades.findIndex(grade => grade.id === id);
        if (index !== -1) {
            this.grades.splice(index, 1);
        } else {
            throw new Error('Grade not found');
        }
    }

    toDto(): GradeDTO {
        return new GradeDTO(this.id, this.value, this.subject, this.weight, this.date);
    }

    getGradeInformation(): string {
        let info = GradeInfo.getGradeInformation(this.toDto());
        return info;
    }

    doesGradePass(): boolean {
        return this.getValue() >= appGlobals.passingGrade;
    }

    static doesGradePass(grade: number): boolean {
        return grade >= appGlobals.passingGrade;
    }
}