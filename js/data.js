/**
 * 麗園國小常見電腦問題指南 - 資料集
 * 包含四大核心分類、問題清單、詳細成因、解決方案與步驟配圖
 */

const GUIDE_DATA = [
  {
    id: "hardware",
    title: "一、班級電腦硬體與設備問題",
    shortTitle: "硬體與設備問題",
    icon: "monitor",
    badge: "班級設備",
    color: "blue",
    description: "開機畫面黑底白字、BIOS設定、大屏觸控線鬆脫與粉筆灰清理",
    items: [
      {
        id: "hw-1",
        title: "開機畫面呈現黑底白字",
        tags: ["開機", "黑底白字", "BIOS", "N4660", "主機", "久未供電", "CMOS"],
        cause: "主機久未供電（常見於連假後或總電源關閉，導致主機板電池弱電，請維持大屏主機與教師用主機穩定供電）。",
        solution: "開機後狂按 DELETE 進入更改 BIOS 設定參數。若完成下列設定仍無法正常開機請洽資訊組。",
        biosSteps: [
          {
            step: 1,
            title: "調整日期與時間",
            desc: "在 <code>Main</code> 頁籤調整 <code>System Date</code> 與 <code>System Time</code>（按數字鍵輸入並按 ENTER 切換）。",
            img: "assets/images/bios_step_1.png",
            tip: "連假後主機斷電常導致時間重置為出廠日期，請務必先校正年份與時間。"
          },
          {
            step: 2,
            title: "進入 Integrated Peripherals",
            desc: "進入 <code>Advanced</code> 頁籤，使用方向鍵選擇 <code>Integrated Peripherals</code> 並按 ENTER 進入。",
            img: "assets/images/bios_step_2.png"
          },
          {
            step: 3,
            title: "設定斷電後不自動開機",
            desc: "進入 <code>Power</code> 頁籤，將 <code>Restore On AC Power Loss</code> 設為 <code>[Off]</code>（斷電後不自動開機）。",
            img: "assets/images/bios_step_3.png",
            tip: "若設為 On，教室總電源開啟時主機會同時通電啟動，建議設為 Off。"
          },
          {
            step: 4,
            title: "設定 SATA 模式為 AHCI",
            desc: "在 <code>Advanced</code> 頁籤中，將 <code>Onboard SATA Mode</code> 設為 <code>[AHCI]</code>。",
            img: "assets/images/bios_step_4.png",
            tip: "若設定錯誤可能導致開機抓不到硬碟系統磁區 (Inaccessible Boot Device)。"
          },
          {
            step: 5,
            title: "關閉安全開機 (Secure Boot)",
            desc: "進入 <code>Security</code> 頁籤，將 <code>Secure Boot</code> 設為 <code>[Disabled]</code>。",
            img: "assets/images/bios_step_5.png"
          },
          {
            step: 6,
            title: "關閉 CSM (Launch CSM)",
            desc: "進入 <code>Boot Options</code> 頁籤，將 <code>Launch CSM</code> 設為 <code>[Never]</code>。",
            img: "assets/images/bios_step_6.png"
          },
          {
            step: 7,
            title: "存檔並離開 (Save & Exit)",
            desc: "進入 <code>Exit</code> 頁籤或直接按鍵盤 <code>F10</code>，選擇 <code>Save & Exit Setup</code>，點選 <code>Yes</code> 存檔重開機。",
            img: "assets/images/bios_step_7.png",
            tip: "重開機後應可順利進入 Windows 系統，若出現異常藍白畫面請洽資訊組。"
          }
        ],
        extraImages: [
          { title: "N4660 BIOS 設定總圖 (第 1 頁)", img: "assets/images/bios_page_1.png" },
          { title: "N4660 BIOS 設定總圖 (第 2 頁)", img: "assets/images/bios_page_2.png" },
          { title: "N4660 BIOS 設定總圖 (第 3 頁)", img: "assets/images/bios_page_3.png" }
        ],
        links: [
          {
            title: "BIOS 設定參數步驟圖片檔 (Google Drive 備用雲端資料夾)",
            url: "https://drive.google.com/drive/folders/1asHcaOASLPvQ2CN-UvLiPet9oJML3GW3?usp=drive_link"
          }
        ],
        notice: "如果依上述 7 個步驟設定後依然無法正常進入 Windows 桌面，請利用上方「報修專區」通報資訊組處理。"
      },
      {
        id: "hw-2",
        title: "大屏觸控故障不靈敏",
        tags: ["大屏", "觸控螢幕", "不靈敏", "粉筆灰", "Touch USB", "紅外線"],
        cause: "可能黑板粉筆灰過多遮蔽四周紅外線感應框，或牆壁上/大屏後方主機的 Touch USB 觸控線鬆脫。",
        solutions: [
          {
            label: "解決方式 1",
            text: "拿微濕軟布或螢幕清潔布，將大屏四周及下方邊框的粉筆灰徹底擦拭乾淨（特別注意邊角凹槽紅外線感應條）。"
          },
          {
            label: "解決方式 2",
            text: "檢查大螢幕本體與牆壁/講桌主機之間的「Touch USB 觸控線」（通常為扁平或有標記 Touch 的 USB 線），將其拔除重新插緊。"
          }
        ],
        notice: "若擦拭清潔並重插觸控線後仍完全無觸控反應，請先將大屏電源開關關閉 10 秒後重新開啟測試。"
      }
    ]
  },
  {
    id: "network",
    title: "二、網路連線問題",
    shortTitle: "網路連線問題",
    icon: "wifi",
    badge: "校園無線網路",
    color: "emerald",
    description: "校園 Wi-Fi 連線設定、eduroam 帳號密碼登入教學",
    items: [
      {
        id: "net-1",
        title: "如何加入學校無線網路？",
        tags: ["無線網路", "Wi-Fi", "WiFi", "eduroam", "網路連線", "帳號", "MAC Address"],
        cause: "筆記型電腦、平板或個人手機在校園需要快速連線網路。",
        solution: "個人資訊設備請多加使用「eduroam」連線方式。輸入個人校務行政系統帳號即可通過認證，無須向資訊組登記 MAC Address！",
        details: [
          {
            label: "Wi-Fi 網路名稱 (SSID)",
            value: "eduroam"
          },
          {
            label: "連線帳號 (身分識別)",
            value: "新北市校務行政系統帳號（若設備要求輸入完整帳號，請輸入：帳號@ntpc.edu.tw）"
          },
          {
            label: "連線密碼",
            value: "新北市校務行政系統密碼"
          },
          {
            label: "EAP 方法 (若手機詢問)",
            value: "PEAP"
          },
          {
            label: "階段 2 驗證",
            value: "MSCHAPV2"
          },
          {
            label: "CA 憑證",
            value: "使用系統憑證 或 不進行驗證"
          }
        ],
        tips: [
          "『eduroam』為全球大專院校及新北市各級學校跨校通用漫遊，設定一次後，前往其他學校也能自動連線！",
          "無須提供網卡 MAC Address 給資訊組，隨連隨用最省時。",
          "若剛更改過校務行政系統密碼，請記得在手機/筆電忘記此 Wi-Fi 後重新輸入新密碼登入。"
        ],
        links: [
          {
            title: "eduroam 跨校漫遊無線網路操作設定說明 (Google Drive 文件)",
            url: "https://drive.google.com/file/d/1qYtrzTUNMLptEArewyPfuPMF4kSJqHFq/view?usp=sharing"
          }
        ]
      }
    ]
  },
  {
    id: "school-system",
    title: "三、校務系統與帳號密碼問題",
    shortTitle: "校務系統與帳號密碼",
    icon: "key",
    badge: "帳號與密碼",
    color: "amber",
    description: "學生帳號密碼還原、預設密碼 3 日限制、忘記密碼、SSO 單一簽入、備用信箱驗證與 Adobe 帳號啟用",
    items: [
      {
        id: "sys-1",
        title: "親師生平台學生帳號密碼有問題",
        tags: ["親師生平台", "學生帳號", "學生密碼", "導師還原", "還原密碼規則"],
        cause: "學生遺忘密碼、輸入錯誤多次被鎖定或無法登入親師生平台。",
        solution: "由班級導師登入校務行政系統中的「學生帳號管理」，點選該名學生的密碼按「還原」。",
        keyPoints: [
          "還原權限：班級導師即可直接於系統操作，無須等待資訊組。",
          "還原密碼規則：出生年月日、身分證字號、同學生帳號（三選一，依導師還原時之設定）。",
          "還原後提醒：學生登入後請依照系統提示儘速自訂安全密碼。"
        ],
        links: [
          {
            title: "校務系統資安防護措施說明-學生版本 (新北市教育局 MIS 官方 PDF)",
            url: "https://mis.ntpc.edu.tw/p/405-1001-13445,c417.php"
          }
        ],
        images: [
          { title: "學生密碼安全措施說明", img: "assets/images/student_sec_2.png" }
        ]
      },
      {
        id: "sys-2",
        title: "學生預設密碼逾期未修改（3日內），無法登入系統",
        tags: ["預設密碼", "3日限制", "無法登入", "逾期", "監護人", "在籍學校"],
        cause: "為維護系統資訊安全，新北市校務行政系統已啟用密碼安全措施：預設密碼自設定起 3 日以內若未完成修改自訂密碼，系統將自動限制登入。",
        solutionList: [
          {
            role: "解法 1（家長/監護人自處）",
            text: "由「學生帳號監護人」使用「忘記密碼」功能並自訂密碼。"
          },
          {
            role: "解法 2（班級導師協助）",
            text: "由「在籍學校」班級導師協助於校務行政系統中，將密碼再次還原為預設密碼。"
          }
        ],
        notes: [
          "註 1：『學生帳號監護人』包含學生本人、家長、導師、任課教師及資訊組長等具有還原當事人密碼權限者，其經驗證過之備用信箱或行動電話皆可當作該生忘記密碼之驗證方式。",
          "註 2：請務必於導師還原密碼後『立即』登入校務行政系統並自訂密碼，否則超過 3 日後仍將再次被限制登入！"
        ],
        images: [
          { title: "強化密碼說明（學生版）", img: "assets/images/student_sec_2.png" }
        ]
      },
      {
        id: "sys-3",
        title: "如果無法使用忘記密碼，要請誰幫忙還原密碼？",
        tags: ["忘記密碼", "還原對象", "教職員工", "志工", "家長", "資訊組"],
        cause: "未設定備用信箱/手機或驗證因子失效，無法自行透過系統信箱簡訊重設密碼。",
        roles: [
          {
            identity: "教職員工",
            contact: "請本校「資訊業務承辦人（資訊組長）」協助還原。"
          },
          {
            identity: "志工",
            contact: "請本校「志工業務承辦人」協助還原。"
          },
          {
            identity: "家長",
            contact: "請學生「班級導師」協助還原。"
          },
          {
            identity: "學生",
            contact: "請「班級導師」或主要學校管理人員協助還原。"
          }
        ],
        images: [
          { title: "密碼還原對象指引（教職員工/志工/家長）", img: "assets/images/staff_sec_9.png" }
        ]
      },
      {
        id: "sys-4",
        title: "為何無法執行忘記密碼？",
        tags: ["忘記密碼", "無法執行", "備用信箱", "行動電話", "驗證因子"],
        cause: "「忘記密碼」功能必須該帳號先前已成功驗證過「備用信箱」或「行動電話」才能發送驗證碼。",
        solution: "若尚未驗證過備用信箱或行動電話，系統無法發送臨時驗證碼，因此無法執行自訂重設。請先由對應承辦人（教職員請洽資訊組、家長請洽導師）協助還原密碼登入後，立刻前往個人資料補辦驗證。",
        images: [
          { title: "驗證因子狀態檢視", img: "assets/images/staff_sec_4.png" }
        ]
      },
      {
        id: "sys-5",
        title: "單一簽入 (SSO) 為何沒有忘記密碼或修改密碼的地方？",
        tags: ["SSO", "單一簽入", "修改密碼", "esa.ntpc.edu.tw", "校務行政系統"],
        cause: "新北市各教學平台之單一簽入 (SSO) 帳號源頭為「新北市校務行政系統」(esa.ntpc.edu.tw)。",
        solution: "請直接連結至「新北市校務行政系統」(https://esa.ntpc.edu.tw) 登入頁面，該系統登入框下方即有「忘記密碼」以及登入後的「變更密碼」功能。",
        link: "https://esa.ntpc.edu.tw",
        images: [
          { title: "SSO 與校務行政登入入口對照", img: "assets/images/staff_sec_5.png" }
        ]
      },
      {
        id: "sys-6",
        title: "如何驗證備用信箱及行動電話？",
        tags: ["驗證信箱", "驗證手機", "個人資料", "密碼修改", "備用信箱"],
        cause: "預防日後忘記密碼無法登入，且為後續雙因子驗證之必備條件。",
        steps: [
          {
            stepNum: 1,
            title: "點選右上角個人身分",
            desc: "登入校務行政系統 (esa.ntpc.edu.tw) 後，選擇首頁右上角「姓名職稱」或「姓名班級」部分。",
            img: "assets/images/staff_sec_6.png"
          },
          {
            stepNum: 2,
            title: "進入個人資料/密碼修改",
            desc: "在下拉選單中選擇「個人資料/密碼修改」。",
            img: "assets/images/staff_sec_7.png"
          },
          {
            stepNum: 3,
            title: "點此驗證備用信箱與行動電話",
            desc: "在驗證因子欄位中，針對備用信箱或行動電話點選「請點此重新驗證」或「點此設定」進行驗證，接收驗證碼輸入完成即可啟用！",
            img: "assets/images/staff_sec_8.png"
          }
        ],
        extraImages: [
          { title: "教職員工驗證介面", img: "assets/images/staff_sec_15.png" },
          { title: "學生帳號驗證介面", img: "assets/images/student_sec_7.png" }
        ]
      },
      {
        id: "sys-7",
        title: "新北市 Adobe 帳號啟用與 Acrobat PDF 專業版教學",
        tags: ["Adobe", "Acrobat", "PDF", "親師生平台", "教育授權", "apps.ntpc.edu.tw", "呂聰賢", "PDF編輯", "授權啟動"],
        cause: "教學與公務常需使用 PDF 編輯、合併、轉檔 Word 或數位填寫簽署，新北市教育局已為師生採購正版授權，需透過親師生平台完成帳號啟用認證。",
        solution: "使用個人新北市 Google 帳號 (apps.ntpc.edu.tw) 註冊 Adobe，至親師生平台點選「Adobe (奧多比)」啟動授權，登入軟體時選取「公司或學校帳戶」即可免費享受正版完整功能！",
        steps: [
          {
            stepNum: 1,
            title: "確認新北市 Google 帳號",
            desc: "先登入親師生平台 (play.ntpc.edu.tw) 或確認個人新北市 Google 帳號（格式為：<code>自訂帳號@apps.ntpc.edu.tw</code>）。"
          },
          {
            stepNum: 2,
            title: "前往 Adobe 官網註冊/登入",
            desc: "前往 <a href='https://www.adobe.com/tw/' target='_blank' rel='noopener noreferrer' style='color:var(--primary);font-weight:700;'>Adobe 台灣官網</a>，使用上述新北市 Google 帳號進行註冊或確認已存在帳號。"
          },
          {
            stepNum: 3,
            title: "登入親師生平台進行授權啟動",
            desc: "至新北市親師生平台 (play.ntpc.edu.tw)，搜尋並點選「Adobe (奧多比)」應用程式，輸入新北市 Google 帳號完成授權綁定。"
          },
          {
            stepNum: 4,
            title: "下載安裝 Acrobat Pro 專業版",
            desc: "至 Adobe 官網或 Creative Cloud 桌面應用程式下載安裝 Acrobat 專業版 PDF 編輯器。"
          },
          {
            stepNum: 5,
            title: "登入時切換為新北市教育局授權",
            desc: "開啟軟體登入時，若出現帳戶類型選單，請務必選擇「<strong>公司或學校帳戶（新北市教育局）</strong>」，即可享有完整正版功能並切換為繁體中文介面。"
          }
        ],
        links: [
          {
            title: "新北市親師生平台 (play.ntpc.edu.tw) - 授權啟動入口",
            url: "https://play.ntpc.edu.tw"
          },
          {
            title: "Adobe 官方網站 (台灣)",
            url: "https://www.adobe.com/tw/"
          },
          {
            title: "Adobe Creative Cloud 桌面應用程式下載",
            url: "https://creativecloud.adobe.com/apps/all/desktop"
          },
          {
            title: "呂聰賢老師『Acrobat PDF 編輯神器』完整教學 (Padlet 講義與影音)",
            url: "https://padlet.com/lubloger/acrobat-pdf-ea4hj8836ylewil3"
          }
        ],
        tips: [
          "若登入後顯示試用期或未授權，通常是因為登入時誤選了「個人帳戶」，請登出後重新登入並選取「公司或學校帳戶（新北市教育局）」。",
          "呂聰賢老師教學看板內含豐富影音課程：包含論文 PDF 轉 Word、PDF 頁面旋轉/刪除/插入、電子簽章與表格填寫，推薦教職員工參閱運用。"
        ]
      }
    ]
  },
  {
    id: "two-factor",
    title: "四、雙因子驗證問題（針對非學生身分：教職員工、志工、家長）",
    shortTitle: "雙因子驗證問題",
    icon: "shield-check",
    badge: "非學生身分專用",
    color: "purple",
    description: "校園通 APP 雙因子、3次直接登入機會、信任裝置30天設定與注意事項",
    items: [
      {
        id: "2fa-1",
        title: "校園通 APP 也需要雙因子驗證嗎？",
        tags: ["校園通APP", "雙因子驗證", "手機簡訊", "電子郵件", "APP驗證"],
        cause: "新北市教育局為強化資安，校園通 APP 亦同步納入資安防護規範。",
        solution: "是的，校園通 APP 同樣需要雙因子驗證！但請特別注意：校園通 APP 本身的驗證方式僅限「手機簡訊」及「電子郵件」（APP 內無法選擇自身發送的 APP 推播驗證）。",
        images: [
          { title: "兩步驟驗證方式說明（校園通APP）", img: "assets/images/staff_sec_11.png" }
        ]
      },
      {
        id: "2fa-2",
        title: "如果沒有驗證過信箱跟手機，要如何使用雙因子登入？",
        tags: ["未驗證信箱", "未驗證手機", "3次直接登入", "緊急登入", "登入次數"],
        cause: "初次啟用雙因子或先前尚未完成備用信箱/行動電話驗證之非學生使用者。",
        solution: "系統貼心提供 3 次「直接登入」的機會！請務必好好利用這 3 次機會成功登入後，第一時間至「個人資料/密碼修改」完成「備用信箱」及「行動電話」驗證，後續即可順暢使用簡訊或 Email 進行雙因子驗證登入。",
        warning: "切勿連續耗盡 3 次機會而不進行驗證，否則將失去直接登入權限！",
        images: [
          { title: "3次直接登入說明圖", img: "assets/images/staff_sec_12.png" }
        ]
      },
      {
        id: "2fa-3",
        title: "如果 3 次直接登入機會用完了怎麼辦？",
        tags: ["3次用完", "次數歸零", "還原密碼", "系統管理員", "資訊組"],
        cause: "3 次直接登入額度已全數用盡，且未通過雙因子認證，系統將全面鎖定登入。",
        solution: "須請「主要學校」系統管理人員（本校教職員請洽資訊組長，家長請洽班級導師）協助還原密碼。使用還原後的預設密碼重新登入時，該 3 次直接登入機會將「重新計算」！請重新登入後務必立即完成備用信箱與手機綁定。",
        images: [
          { title: "3次直接登入用完處理辦法", img: "assets/images/staff_sec_16.png" }
        ]
      },
      {
        id: "2fa-4",
        title: "每次登入都要驗證，可否記錄裝置？",
        tags: ["記錄裝置", "信任此裝置30天", "略過驗證", "公用電腦", "30天"],
        cause: "每次登入都需要收簡訊或開信箱輸入驗證碼較耗時。",
        solution: "可以！選擇「手機簡訊」或「電子郵件」驗證時，可於輸入驗證碼前勾選「信任此裝置30天（勾選將略過二步驟驗證）」，同一台設備於一個月內即可免於重複驗證。",
        precautions: [
          "『APP 驗證』方式流程不同，目前無信任裝置選項。",
          "班級公用電腦或共用電腦『強烈建議勿勾選信任裝置』，以確保帳號安全！",
          "如同一台裝置登入不同帳號，前一個帳號的信任記錄將被覆蓋。",
          "瀏覽器若進行更版或清除快取/Cookie，將被視為新裝置，需重新勾選信任。"
        ],
        images: [
          { title: "信任裝置 30 天說明圖", img: "assets/images/staff_sec_17.png" }
        ]
      }
    ]
  }
];

// 校園報修指南資料
const REPAIR_INFO = {
  schoolName: "新北市林口區麗園國民小學",
  onlineFormUrl: "https://esa.ntpc.edu.tw/web-maintain/templates/maintain_pub.html?schno=014793",
  noticeItems: [
    "報修前請先記錄教室編號、設備型號（如主機 N4660、大螢幕品牌）。",
    "若為開機黑底白字，請先嘗試參照指南進行 BIOS 7 步驟重設。",
    "大屏觸控問題請先確認邊框粉筆灰已擦拭乾淨、USB 觸控線已重插。",
    "帳號密碼鎖定請依身分聯絡對應人員（學生與家長聯絡導師、教職員聯絡資訊組）。",
    "若依然無法排除，請至線上報修系統填單，資訊組將儘速派員排查。"
  ]
};
