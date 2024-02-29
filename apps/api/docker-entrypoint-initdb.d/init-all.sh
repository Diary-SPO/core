#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE SEQUENCE public."SPO_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.absencetype_id_seq;

CREATE SEQUENCE public.absencetype_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.auth_id_seq;

CREATE SEQUENCE public.auth_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.classroom_id_seq;

CREATE SEQUENCE public.classroom_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.diaryuser_id_seq;

CREATE SEQUENCE public.diaryuser_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."examinationType_id_seq";

CREATE SEQUENCE public."examinationType_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.groups_id_seq;

CREATE SEQUENCE public.groups_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."lessonType_id_seq";

CREATE SEQUENCE public."lessonType_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."markValue_id_seq";

CREATE SEQUENCE public."markValue_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.schedule_id_seq;

CREATE SEQUENCE public.schedule_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.subgroup_id_seq;

CREATE SEQUENCE public.subgroup_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.subject_id_seq;

CREATE SEQUENCE public.subject_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.subject_id_seq1;

CREATE SEQUENCE public.subject_id_seq1
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.subject_id_seq2;

CREATE SEQUENCE public.subject_id_seq2
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."taskType_id_seq";

CREATE SEQUENCE public."taskType_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.task_id_seq;

CREATE SEQUENCE public.task_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.teacher_id_seq;

CREATE SEQUENCE public.teacher_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public."termType_id_seq";

CREATE SEQUENCE public."termType_id_seq"
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.term_id_seq;

CREATE SEQUENCE public.term_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.terms_id_seq;

CREATE SEQUENCE public.terms_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.theme_id_seq;

CREATE SEQUENCE public.theme_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public."SPO" определение

-- Drop table

-- DROP TABLE public."SPO";

CREATE TABLE public."SPO" (
	id serial4 NOT NULL,
	abbreviation text NOT NULL,
	"name" text NOT NULL,
	"shortName" text NOT NULL,
	"actualAddress" text NOT NULL,
	email varchar(50) NOT NULL,
	site varchar(75) NOT NULL,
	phone varchar(25) NOT NULL,
	"type" varchar(20) NOT NULL,
	"directorName" varchar(85) NOT NULL,
	"organizationId" varchar NOT NULL,
	CONSTRAINT "SPO_pkey" PRIMARY KEY (id),
	CONSTRAINT spo_unique UNIQUE ("organizationId")
);


-- public."absenceType" определение

-- Drop table

-- DROP TABLE public."absenceType";

CREATE TABLE public."absenceType" (
	id int2 DEFAULT nextval('absencetype_id_seq'::regclass) NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT absencetype_pk PRIMARY KEY (id),
	CONSTRAINT absencetype_unique UNIQUE (name)
);


-- public."examinationType" определение

-- Drop table

-- DROP TABLE public."examinationType";

CREATE TABLE public."examinationType" (
	id serial4 NOT NULL,
	"name" varchar(35) NOT NULL,
	CONSTRAINT "_examinationType__pk" PRIMARY KEY (id),
	CONSTRAINT "_examinationType__unique" UNIQUE (name)
);


-- public."lessonType" определение

-- Drop table

-- DROP TABLE public."lessonType";

CREATE TABLE public."lessonType" (
	id smallserial NOT NULL,
	"name" varchar(25) NOT NULL,
	CONSTRAINT "lessonType_name_key" UNIQUE (name),
	CONSTRAINT "lessonType_pkey" PRIMARY KEY (id)
);


-- public."markValue" определение

-- Drop table

-- DROP TABLE public."markValue";

CREATE TABLE public."markValue" (
	id smallserial NOT NULL,
	value varchar(35) NOT NULL,
	CONSTRAINT "_markValue__pk" PRIMARY KEY (id),
	CONSTRAINT "_markValue__unique" UNIQUE (value)
);


-- public.subject определение

-- Drop table

-- DROP TABLE public.subject;

CREATE TABLE public.subject (
	id serial4 NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT subject_pk PRIMARY KEY (id),
	CONSTRAINT subject_unique UNIQUE (name)
);


-- public."taskType" определение

-- Drop table

-- DROP TABLE public."taskType";

CREATE TABLE public."taskType" (
	id smallserial NOT NULL,
	"name" varchar(25) NOT NULL,
	CONSTRAINT "taskType_name_key" UNIQUE (name),
	CONSTRAINT "taskType_pkey" PRIMARY KEY (id)
);


-- public."termType" определение

-- Drop table

-- DROP TABLE public."termType";

CREATE TABLE public."termType" (
	id serial4 NOT NULL,
	value varchar(25) NOT NULL,
	CONSTRAINT "_termType__pk" PRIMARY KEY (id),
	CONSTRAINT "_termType__unique" UNIQUE (value)
);


-- public.classroom определение

-- Drop table

-- DROP TABLE public.classroom;

CREATE TABLE public.classroom (
	id serial4 NOT NULL,
	building varchar NOT NULL,
	"name" varchar NOT NULL,
	"spoId" int4 NOT NULL,
	"idFromDiary" int4 NOT NULL,
	CONSTRAINT classroom_pk PRIMARY KEY (id),
	CONSTRAINT classroom_unique UNIQUE ("idFromDiary", "spoId", name, building),
	CONSTRAINT classroom_spo_fk_1 FOREIGN KEY ("spoId") REFERENCES public."SPO"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public."group" определение

-- Drop table

-- DROP TABLE public."group";

CREATE TABLE public."group" (
	id int4 DEFAULT nextval('groups_id_seq'::regclass) NOT NULL,
	"spoId" int4 NOT NULL,
	"groupName" varchar(31) NOT NULL,
	"idFromDiary" int4 NOT NULL,
	CONSTRAINT "groups_diaryGroupId_spoId_key" UNIQUE ("idFromDiary", "spoId"),
	CONSTRAINT groups_pkey PRIMARY KEY (id),
	CONSTRAINT "groups_spoId_fkey" FOREIGN KEY ("spoId") REFERENCES public."SPO"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.subgroup определение

-- Drop table

-- DROP TABLE public.subgroup;

CREATE TABLE public.subgroup (
	id serial4 NOT NULL,
	"name" varchar NULL,
	"groupId" int4 NULL,
	CONSTRAINT subgroup_pk PRIMARY KEY (id),
	CONSTRAINT subgroup_unique UNIQUE (name, "groupId"),
	CONSTRAINT subgroup_group_fk FOREIGN KEY ("groupId") REFERENCES public."group"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.teacher определение

-- Drop table

-- DROP TABLE public.teacher;

CREATE TABLE public.teacher (
	id serial4 NOT NULL,
	"spoId" int4 NOT NULL,
	"firstName" varchar(45) NOT NULL,
	"lastName" varchar(45) NOT NULL,
	"middleName" varchar(45) NULL,
	"idFromDiary" int4 NOT NULL,
	CONSTRAINT teacher_pkey PRIMARY KEY (id),
	CONSTRAINT teacher_unique UNIQUE ("spoId", "idFromDiary"),
	CONSTRAINT "teacher_spoId_fkey" FOREIGN KEY ("spoId") REFERENCES public."SPO"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public."academicYear" определение

-- Drop table

-- DROP TABLE public."academicYear";

CREATE TABLE public."academicYear" (
	id int4 DEFAULT nextval('term_id_seq'::regclass) NOT NULL,
	"termTypeId" int4 NOT NULL,
	"number" int2 NOT NULL,
	"groupId" int4 NOT NULL,
	"idFromDiary" int4 NOT NULL,
	CONSTRAINT term_pk PRIMARY KEY (id),
	CONSTRAINT academicyear_group_fk FOREIGN KEY ("groupId") REFERENCES public."group"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT academicyear_termtype_fk FOREIGN KEY ("termTypeId") REFERENCES public."termType"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public."diaryUser" определение

-- Drop table

-- DROP TABLE public."diaryUser";

CREATE TABLE public."diaryUser" (
	id int4 DEFAULT nextval('diaryuser_id_seq'::regclass) NOT NULL,
	"groupId" int4 NOT NULL,
	login varchar(45) NOT NULL,
	"password" varchar NOT NULL,
	phone varchar(45) NULL,
	birthday date NOT NULL,
	"firstName" varchar(40) NOT NULL,
	"lastName" varchar(40) NOT NULL,
	"middleName" varchar(40) NULL,
	cookie text NOT NULL,
	"cookieLastDateUpdate" date NOT NULL,
	"isAdmin" bool DEFAULT false NOT NULL,
	"idFromDiary" int4 NOT NULL,
	CONSTRAINT "diaryUser_pkey" PRIMARY KEY (id),
	CONSTRAINT "diaryUser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."group"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public."finalMark" определение

-- Drop table

-- DROP TABLE public."finalMark";

CREATE TABLE public."finalMark" (
	"subjectId" int4 NOT NULL,
	"diaryUserId" int4 NOT NULL,
	"markValueId" int4 NOT NULL,
	CONSTRAINT finalmark_pk PRIMARY KEY ("subjectId", "diaryUserId"),
	CONSTRAINT "_finalMark__diaryUser_FK" FOREIGN KEY ("diaryUserId") REFERENCES public."diaryUser"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT finalmark_markvalue_fk FOREIGN KEY ("markValueId") REFERENCES public."markValue"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT finalmark_subject_fk FOREIGN KEY ("subjectId") REFERENCES public.subject(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.schedule определение

-- Drop table

-- DROP TABLE public.schedule;

CREATE TABLE public.schedule (
	id serial4 NOT NULL,
	"groupId" int4 NOT NULL,
	"teacherId" int4 NULL,
	"subjectId" int4 NOT NULL,
	"date" date NOT NULL,
	"startTime" varchar(5) NOT NULL,
	"endTime" varchar(5) NOT NULL,
	"classroomId" int4 NOT NULL,
	CONSTRAINT schedule_pkey PRIMARY KEY (id),
	CONSTRAINT schedule_unique UNIQUE ("groupId", "subjectId", date, "startTime", "endTime", "classroomId"),
	CONSTRAINT schedule_classroom_fk FOREIGN KEY ("classroomId") REFERENCES public.classroom(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "schedule_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public."group"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT schedule_subject_fk FOREIGN KEY ("subjectId") REFERENCES public.subject(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "schedule_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public.teacher(id)
);


-- public."scheduleSubgroup" определение

-- Drop table

-- DROP TABLE public."scheduleSubgroup";

CREATE TABLE public."scheduleSubgroup" (
	"scheduleId" int4 NOT NULL,
	"subgroupId" int4 NOT NULL,
	"diaryUserId" int4 NOT NULL,
	CONSTRAINT schedulesubgroup_unique UNIQUE ("scheduleId", "diaryUserId"),
	CONSTRAINT "_scheduleSubgroup__schedule_FK" FOREIGN KEY ("scheduleId") REFERENCES public.schedule(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "_scheduleSubgroup__subgroup_FK" FOREIGN KEY ("subgroupId") REFERENCES public.subgroup(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT schedulesubgroup_diaryuser_fk FOREIGN KEY ("diaryUserId") REFERENCES public."diaryUser"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.term определение

-- Drop table

-- DROP TABLE public.term;

CREATE TABLE public.term (
	id int4 DEFAULT nextval('terms_id_seq'::regclass) NOT NULL,
	"idFromDiary" int4 NOT NULL,
	"number" int4 NOT NULL,
	"isActive" bool NOT NULL,
	"academicYearId" int4 NOT NULL,
	CONSTRAINT terms_pk PRIMARY KEY (id),
	CONSTRAINT terms_academicyear_fk FOREIGN KEY ("academicYearId") REFERENCES public."academicYear"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public."termSubject" определение

-- Drop table

-- DROP TABLE public."termSubject";

CREATE TABLE public."termSubject" (
	"termId" int4 NOT NULL,
	"subjectId" int4 NOT NULL,
	"diaryUserId" int4 NOT NULL,
	"markValueId" int4 NULL,
	"teacherId" int4 NULL,
	"examinationTypeId" int4 NULL,
	CONSTRAINT termsubject_pk PRIMARY KEY ("termId", "subjectId", "diaryUserId"),
	CONSTRAINT "_termSubject__diaryUser_FK" FOREIGN KEY ("diaryUserId") REFERENCES public."diaryUser"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "_termSubject__terms_FK" FOREIGN KEY ("termId") REFERENCES public.term(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT termsubject_examinationtype_fk FOREIGN KEY ("examinationTypeId") REFERENCES public."examinationType"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT termsubject_markvalue_fk FOREIGN KEY ("markValueId") REFERENCES public."markValue"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT termsubject_subject_fk FOREIGN KEY ("subjectId") REFERENCES public.subject(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT termsubject_teacher_fk FOREIGN KEY ("teacherId") REFERENCES public.teacher(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.auth определение

-- Drop table

-- DROP TABLE public.auth;

CREATE TABLE public.auth (
	id serial4 NOT NULL,
	"idDiaryUser" int4 NOT NULL,
	"token" varchar(24) NOT NULL,
	"lastUsedDate" date NOT NULL,
	CONSTRAINT auth_pkey PRIMARY KEY (id),
	CONSTRAINT auth_token_token1_key UNIQUE (token) INCLUDE (token),
	CONSTRAINT "auth_idDiaryUser_fkey" FOREIGN KEY ("idDiaryUser") REFERENCES public."diaryUser"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.gradebook определение

-- Drop table

-- DROP TABLE public.gradebook;

CREATE TABLE public.gradebook (
	id int4 DEFAULT nextval('groups_id_seq'::regclass) NOT NULL,
	"scheduleId" int4 NOT NULL,
	"lessonTypeId" int2 NOT NULL,
	"idFromDiary" int4 NOT NULL,
	"absenceTypeId" int2 NULL,
	CONSTRAINT gradebook_pkey PRIMARY KEY (id),
	CONSTRAINT gradebook__absencetype__fk FOREIGN KEY ("absenceTypeId") REFERENCES public."absenceType"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "gradebook_lessonTypeId_fkey" FOREIGN KEY ("lessonTypeId") REFERENCES public."lessonType"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "gradebook_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES public.schedule(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.task определение

-- Drop table

-- DROP TABLE public.task;

CREATE TABLE public.task (
	id serial4 NOT NULL,
	"gradebookId" int4 NOT NULL,
	"taskTypeId" int4 NOT NULL,
	topic varchar NULL,
	"idFromDiary" int4 NOT NULL,
	CONSTRAINT task_pk PRIMARY KEY (id),
	CONSTRAINT task_gradebook_fk FOREIGN KEY ("gradebookId") REFERENCES public.gradebook(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT task_tasktype_fk_1 FOREIGN KEY ("taskTypeId") REFERENCES public."taskType"(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.theme определение

-- Drop table

-- DROP TABLE public.theme;

CREATE TABLE public.theme (
	id serial4 NOT NULL,
	"gradebookId" int4 NOT NULL,
	description text NOT NULL,
	CONSTRAINT theme_pkey PRIMARY KEY (id),
	CONSTRAINT "theme_gradebookId_fkey" FOREIGN KEY ("gradebookId") REFERENCES public.gradebook(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.mark определение

-- Drop table

-- DROP TABLE public.mark;

CREATE TABLE public.mark (
	"diaryUserId" int4 NOT NULL,
	"taskId" int4 NOT NULL,
	"markValueId" int4 NOT NULL,
	CONSTRAINT "mark_diaryUserId_taskId_key" UNIQUE ("diaryUserId", "taskId"),
	CONSTRAINT mark_pk PRIMARY KEY ("diaryUserId", "taskId"),
	CONSTRAINT "mark_diaryUserId_fkey" FOREIGN KEY ("diaryUserId") REFERENCES public."diaryUser"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT mark_markvalue_fk FOREIGN KEY ("markValueId") REFERENCES public."markValue"(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT mark_task_fk FOREIGN KEY ("taskId") REFERENCES public.task(id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- public.required определение

-- Drop table

-- DROP TABLE public.required;

CREATE TABLE public.required (
	"diaryUserId" int4 NOT NULL,
	"taskId" int4 NOT NULL,
	"isRequired" bool NOT NULL,
	CONSTRAINT required_pk PRIMARY KEY ("diaryUserId", "taskId"),
	CONSTRAINT "requireds_diaryUserId_taskId_key" UNIQUE ("diaryUserId", "taskId"),
	CONSTRAINT required_task_fk FOREIGN KEY ("taskId") REFERENCES public.task(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "requireds_diaryUserId_fkey" FOREIGN KEY ("diaryUserId") REFERENCES public."diaryUser"(id) ON DELETE CASCADE ON UPDATE CASCADE
);
EOSQL