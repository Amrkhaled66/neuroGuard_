import { axiosPrivate ,axiosInstance} from "@/shared/lib/axios";
import { getToken } from "@/shared/utils/authStorage";
import type { CreateSessionPayload } from "../schemas/sessionSchema";
import type { PatientSession } from "../types";

export function getPatientSessions(patientId: number) {
  return axiosPrivate.get<PatientSession[], PatientSession[]>(
    `/sessions/patient/${patientId}`,
  );
}

export function createSession(payload: CreateSessionPayload) {
  const formData = new FormData();

  formData.append("patientId", String(payload.patientId));
  formData.append("duration", String(payload.duration));
  formData.append("channelCount", String(payload.channelCount));

  if (payload.note) {
    formData.append("note", payload.note);
  }

  formData.append("file", payload.sessionFile);

  return axiosPrivate.post<PatientSession, PatientSession>("/sessions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function getDownloadFilename(
  contentDisposition: string | undefined,
  fallbackName: string,
) {
  if (!contentDisposition) {
    return fallbackName;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);

  return filenameMatch?.[1] ?? fallbackName;
}

export async function downloadSessionFile(
  sessionId: number,
  fallbackName = `session-${sessionId}.edf`,
) {
  const token = getToken();
  const response = await axiosInstance.get<Blob>(
    `sessions/${sessionId}/download`,
    {
      responseType: "blob",
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  );

  const blobUrl = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  const fileName = getDownloadFilename(
    response.headers["content-disposition"],
    fallbackName,
  );

  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
}
