"use client"

import { useState } from "react"

// ─── 폼 텍스트 (여기서 수정하세요) ────────────────────────────────────────────
const FIELD_NAME_LABEL = "Name"
const FIELD_NAME_PLACEHOLDER = "홍길동"
const FIELD_EMAIL_LABEL = "Email"
const FIELD_EMAIL_PLACEHOLDER = "hello@example.com"
const FIELD_MESSAGE_LABEL = "Message"
const FIELD_MESSAGE_PLACEHOLDER = "안녕하세요, 프로젝트 협업과 관련해 연락드립니다..."
const SUBMIT_LABEL = "Send"
const SUBMIT_LOADING_LABEL = "보내는 중..."
const MSG_SUCCESS = "메일이 전송됐어요. 곧 답장드릴게요 :)"
const MSG_ERROR = "전송에 실패했어요. 잠시 후 다시 시도해주세요."
// ───────────────────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "rounded-2xl border border-zinc-200 bg-stone-50/80 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-300 outline-none transition-colors focus:border-zinc-400 focus:bg-white"

type Status = "idle" | "loading" | "success" | "error"

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")

    const form = event.currentTarget
    const data = {
      access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "",
      name: (form.elements.namedItem("contact-name") as HTMLInputElement).value,
      email: (form.elements.namedItem("contact-email") as HTMLInputElement).value,
      message: (form.elements.namedItem("contact-message") as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (res.ok && json.success) {
        setStatus("success")
        form.reset()
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {/* 이름 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-name"
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500"
        >
          {FIELD_NAME_LABEL}
        </label>
        <input
          id="contact-name"
          name="contact-name"
          type="text"
          required
          placeholder={FIELD_NAME_PLACEHOLDER}
          className={INPUT_CLASS}
        />
      </div>

      {/* 이메일 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-email"
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500"
        >
          {FIELD_EMAIL_LABEL}
        </label>
        <input
          id="contact-email"
          name="contact-email"
          type="email"
          required
          placeholder={FIELD_EMAIL_PLACEHOLDER}
          className={INPUT_CLASS}
        />
      </div>

      {/* 메시지 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-message"
          className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500"
        >
          {FIELD_MESSAGE_LABEL}
        </label>
        <textarea
          id="contact-message"
          name="contact-message"
          rows={5}
          required
          placeholder={FIELD_MESSAGE_PLACEHOLDER}
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>

      {/* 보내기 버튼 + 상태 메시지 */}
      <div className="mt-2 flex flex-col items-end gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-zinc-900 px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-stone-50 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? SUBMIT_LOADING_LABEL : SUBMIT_LABEL}
        </button>

        {status === "success" && (
          <p className="text-[12px] tracking-wide text-zinc-500">{MSG_SUCCESS}</p>
        )}
        {status === "error" && (
          <p className="text-[12px] tracking-wide text-red-400">{MSG_ERROR}</p>
        )}
      </div>
    </form>
  )
}
