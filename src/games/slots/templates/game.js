(function () {
    const items = [
        '🍭',
        '❌',
        '⛄️',
        '🦄',
        '🍌',
        '💩',
        '👻',
        '😻',
        '💵',
        '🤡',
        '🦖',
        '🍎',
        '😂',
        '🖕',
    ];
    const doors = document.querySelectorAll('.door');

    function init(firstInit = true, groups = 1, duration = 3) {
        for (const door of doors) {
            if (firstInit) {
                door.dataset.spinned = '0';
            } else if (door.dataset.spinned === '1') {
                return;
            }

            const boxes = door.querySelector('.boxes');
            const boxesClone = boxes.cloneNode(false);
            const pool = ['❓'];

            if (!firstInit) {
                const arr = [];
                for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
                    arr.push(...items);
                }
                pool.push(...shuffle(arr));

                boxesClone.addEventListener(
                    'transitionstart',
                    function () {
                        door.dataset.spinned = '1';
                        this.querySelectorAll('.box').forEach((box) => {
                            box.style.filter = 'blur(1px)';
                        });
                    },
                    { once: true }
                );

                boxesClone.addEventListener(
                    'transitionend',
                    function () {
                        this.querySelectorAll('.box').forEach((box, index) => {
                            box.style.filter = 'blur(0)';
                            if (index > 0) this.removeChild(box);
                        });
                    },
                    { once: true }
                );
            }

            for (let i = pool.length - 1; i >= 0; i--) {
                const box = document.createElement('div');
                box.classList.add('box');
                box.style.width = door.clientWidth + 'px';
                box.style.height = door.clientHeight + 'px';
                box.textContent = pool[i];
                boxesClone.appendChild(box);
            }
            boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
            boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
            door.replaceChild(boxesClone, boxes);
        }
    }

    async function spin() {
        const tts = 3;
        init(false, 1, tts);
        const total = tts * 1000;

        for (const door of doors) {
            const boxes = door.querySelector('.boxes');
            const duration = parseInt(boxes.style.transitionDuration);
            boxes.style.transform = 'translateY(0)';
            await new Promise((resolve) => setTimeout(resolve, tts * 100));
        }
        await new Promise((resolve) => setTimeout(resolve, total))
        // {{placeholder}}
        return "victory";
    }

    function shuffle([...arr]) {
        let m = arr.length;
        while (m) {
            const i = Math.floor(Math.random() * m--);
            [arr[m], arr[i]] = [arr[i], arr[m]];
        }
        return arr;
    }

    init();
    $.runFunction = spin;
})();
