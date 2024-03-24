import { AttestationResponse } from "@diary-spo/shared";
import { ICacheData } from "@helpers";
import { detectTerm } from "@models";
import { saveTermSubject } from "./saveTermSubject";

export const saveAttestation = async (data: AttestationResponse, authData: ICacheData) => {
  const currTermId = await detectTerm(authData)

  if (!currTermId) {
    return null
  }

  const subjects = data.subjects
  const profModules = data.profModules
  const courseWorks = data.courseWorks

  saveTermSubject('subjects', currTermId, subjects, authData)
}