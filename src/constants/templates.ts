export const templates = [
  {
    id: "blank",
    label: "Blank Document",
    imageUrl: "/blank-document.svg",
    initialContent: "",
  },
  {
    id: "software-proporsal",
    label: "Software development proporsal",
    imageUrl: "/software-proposal.svg",
    initialContent: `
      <h1>ソフトウェア導入提案書</h1>
      <p>
        <strong>提案先：</strong>株式会社〇〇<br>
        <strong>提案者：</strong>株式会社△△<br>
        <strong>提出日：</strong>2026年◯月◯日
      </p>
      <hr />

      <h2>1. 現状の課題</h2>
      <p>
        現在の業務フローやシステムにおける課題を整理します。
      </p>

      <h2>2. 提案するソフトウェア概要</h2>
      <p>
        ソフトウェアの概要、特徴、対応範囲について説明します。
      </p>

      <h2>3. 主な機能</h2>
      <ul>
        <li>機能①</li>
        <li>機能②</li>
        <li>機能③</li>
      </ul>

      <h2>4. 導入メリット</h2>
      <p>
        業務効率化、コスト削減、品質向上などの効果を記載します。
      </p>

      <h2>5. 導入スケジュール</h2>
      <ol>
        <li>要件定義</li>
        <li>開発・設定</li>
        <li>テスト</li>
        <li>本番導入</li>
      </ol>
    `,
  },
  {
    id: "project-proporsal",
    label: "Project proporsal",
    imageUrl: "/project-proposal.svg",
    initialContent: `
      <h1 style="text-align:center;">プロジェクト提案書</h1>

      <p style="text-align:center;">
        <strong>プロジェクト名：</strong>〇〇プロジェクト<br>
        <strong>提出日：</strong>2026年◯月◯日
      </p>

      <hr />

      <h2>1. 背景・課題</h2>
      <p>
        本プロジェクトを提案する背景や、現在抱えている課題を記載します。
      </p>

      <h2>2. 目的</h2>
      <p>
        本プロジェクトで達成したい目的やゴールを明確に記載します。
      </p>

      <h2>3. 提案内容</h2>
      <p>
        具体的な施策、進め方、想定スケジュールなどを記載します。
      </p>

      <h2>4. 期待される効果</h2>
      <ul>
        <li>効果①</li>
        <li>効果②</li>
        <li>効果③</li>
      </ul>

      <h2>5. スケジュール（概要）</h2>
      <p>
        開始時期：◯年◯月<br>
        完了予定：◯年◯月
      </p>
    `,
  },
  {
    id: "business-letter",
    label: "Business letter",
    imageUrl: "/business-letter.svg",
    initialContent: `
      <p style="text-align:right;">
        <strong>2026年◯月◯日</strong>
      </p>

      <p>
        株式会社〇〇<br>
        〇〇部 〇〇様
      </p>

      <p>
        いつも大変お世話になっております。<br>
        株式会社△△の〇〇でございます。
      </p>
      <p>
        本文をこちらにご記入ください。
      </p>
      <p>
        お手数をおかけいたしますが、<br>
        ご確認のほど何卒よろしくお願い申し上げます。
      </p>
      <br />
      <p>
        ────────────────<br>
        株式会社△△<br>
        〇〇部 〇〇<br>
        Email: example@example.com<br>
        TEL: 00-0000-0000
      </p>
    `,
  },
  {
    id: "resume",
    label: "Resume",
    imageUrl: "/resume.svg",
    initialContent: `
      <h1>履歴書</h1>

      <p>
        <strong>氏名：</strong>〇〇 〇〇<br>
        <strong>Email：</strong>example@example.com<br>
        <strong>電話番号：</strong>00-0000-0000
      </p>
      <hr />

      <h2>職務要約</h2>
      <p>
        これまでのキャリアや強みを簡潔にまとめます。
      </p>

      <h2>スキル</h2>
      <ul>
        <li>スキル①</li>
        <li>スキル②</li>
        <li>スキル③</li>
      </ul>

      <h2>職歴</h2>
      <p>
        <strong>株式会社〇〇</strong>（20XX年〜20XX年）<br>
        役割や担当業務を簡潔に記載します。
      </p>

      <h2>学歴</h2>
      <p>
        〇〇大学 〇〇学部（20XX年卒業）
      </p>
    `,
  },
  {
    id: "cover-letter",
    label: "Cover letter",
    imageUrl: "/cover-letter.svg",
    initialContent: `
      <p style="text-align:right;">
        <strong>2026年◯月◯日</strong>
      </p>

      <p>
        採用ご担当者様
      </p>

      <p>
        はじめまして。<br>
        この度、貴社の募集を拝見し、ぜひ応募させていただきたくご連絡いたしました。
      </p>
      <p>
        私はこれまで〇〇分野において、△△の経験を積んでまいりました。<br>
        特に□□の業務では、◯◯を意識して取り組んできました。
      </p>
      <p>
        本ポジションを通じて、これまでの経験を活かしつつ、<br>
        貴社に価値を提供できると考えております。
      </p>
      <p>
        ご多忙のところ恐れ入りますが、<br>
        ご検討のほど、何卒よろしくお願い申し上げます。
      </p>
      <br />
      <p>
        敬具
      </p>
      <p>
        〇〇 〇〇<br>
        Email: example@example.com
      </p>
    `,
  },
  {
    id: "letter",
    label: "Letter",
    imageUrl: "/letter.svg",
    initialContent: `
      <p style="text-align:right;">
        <strong>2026年◯月◯日</strong>
      </p>

      <p>
        〇〇さん
      </p>

      <p>
        お疲れ様です。〇〇です。
      </p>
      <p>
        本文をこちらにご記入ください。
      </p>
      <p>
        お手数ですが、よろしくお願いします。
      </p>
      <br />
      <p>
        ────────────────<br>
        〇〇 〇〇
        Email: example@example.com<br>
        TEL: 00-0000-0000
      </p>
    `,
  },
];
