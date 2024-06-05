"use client";
import React, { useState, useEffect, useCallback } from 'react';
import LayoutComponent from '@/components/customLayouts/LayoutComponent'; // Ensure this path is correct
import { IoMdMenu } from 'react-icons/io';
import { RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri';

const MAX_STACK_SIZE = 8;

const EditorLayout = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const toggleLeftSidebar = () => setIsLeftSidebarOpen(prev => !prev);
  const toggleRightSidebar = () => setIsRightSidebarOpen(prev => !prev);


  const [content, setContent] = useState('');
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isUndoing, setIsUndoing] = useState(false);
  const [isRedoing, setIsRedoing] = useState(false);

  // Save the current state to the undo stack
  const saveState = useCallback(() => {
    if (!isUndoing && !isRedoing) {
      setUndoStack(prev => [...prev, content]);
      setRedoStack([]);
    }
  }, [content, isUndoing, isRedoing]);

  // Undo the last action
  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      setRedoStack(prev => [...prev, content]);
      setIsUndoing(true);
      const previousContent = undoStack[undoStack.length - 1];
      setUndoStack(prev => prev.slice(0, -1));
      setContent(previousContent);
      setIsUndoing(false);
    }
  }, [content, undoStack]);

  // Redo the last undone action
  const redo = useCallback(() => {
    console.log(redoStack)
    if (redoStack.length > 0) {
      setUndoStack(prev => [...prev, content]);
      setIsRedoing(true);
      const nextContent = redoStack[redoStack.length - 1];
      setRedoStack(prev => prev.slice(0, -1));
      setContent(nextContent);
      setIsRedoing(false);
    }
  }, [content, redoStack]);

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        event.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);

  // Save the initial state and every change to the content
  useEffect(() => {
    if (!isUndoing && !isRedoing) {
      saveState();
    }
  }, [content, saveState, isUndoing, isRedoing]);

  return (
    <div>
      <LayoutComponent
        isLeftSidebarOpen={isLeftSidebarOpen}
        isRightSidebarOpen={isRightSidebarOpen}
      >
        <LayoutComponent.Header>
          <div className='flex justify-between content-center p-1 w-full h-full'>
            <button onClick={toggleLeftSidebar}>
              {isLeftSidebarOpen ? <IoMdMenu /> : <RiMenuUnfoldLine />}
            </button>
            <div>Content</div>
            <button onClick={toggleRightSidebar}>
              {isRightSidebarOpen ? <IoMdMenu /> : <RiMenuFoldLine />}
            </button>
          </div>
        </LayoutComponent.Header>
        <LayoutComponent.LeftSidebar>
          <h2>Left Sidebar Content</h2>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe blanditiis deserunt veritatis laboriosam quod accusamus quasi consectetur quam voluptate ad ea aperiam beatae necessitatibus, ut reprehenderit expedita vero illo hic ratione enim quaerat possimus laborum delectus! Officiis at molestias blanditiis perspiciatis temporibus deserunt dolorum qui fugiat dolore architecto dolores enim soluta facilis optio, molestiae modi libero nesciunt tempore hic veniam! Soluta dolor explicabo nulla sequi itaque voluptate aspernatur velit odio at, voluptates quas totam, repellendus minima vel tempora nesciunt! Error id amet molestias accusantium, tempore assumenda, recusandae veritatis veniam eligendi hic quo nobis placeat laboriosam modi commodi pariatur fuga ipsa minus non voluptatem quibusdam ex nulla. Sint eligendi reprehenderit animi ullam, modi laborum, eveniet fugiat nihil sit repudiandae soluta provident voluptate odit? Debitis cumque impedit consectetur nam quae ad non est reiciendis! Velit necessitatibus minus fugit, pariatur facere dolor perferendis expedita dolores esse cumque nihil? Unde architecto in magni praesentium atque, at repellendus. Perferendis mollitia harum fugit deserunt totam tempora inventore laudantium ducimus odit, voluptate quam assumenda ipsa doloremque quisquam excepturi hic corporis natus rerum qui blanditiis officiis possimus sed porro vel? Voluptates error rem exercitationem magni id, nihil eveniet ipsum inventore veniam laborum consequatur unde officia aliquam commodi facilis praesentium itaque. Voluptate, magni asperiores consequuntur omnis tempora accusamus deleniti rerum commodi repudiandae quod ipsam doloremque libero nihil totam ab quae laborum et. Fugit sequi nesciunt ratione eius quasi, nulla reprehenderit aliquam. Necessitatibus beatae possimus illum saepe minus! Quam facilis, laboriosam nesciunt ducimus eligendi atque natus quasi enim repellendus officia aliquam id repudiandae placeat culpa voluptates tenetur modi necessitatibus vitae eius. Dicta, laboriosam quae. Quisquam ab adipisci magni ducimus repudiandae quaerat praesentium ad aspernatur, ipsam hic. Distinctio libero eligendi pariatur dolore quidem expedita, sequi, ratione voluptate ex quam earum commodi, vero voluptatibus! Quae nisi, architecto libero tempore quo, soluta labore provident sed at corrupti obcaecati rerum, autem dolorum earum atque nemo mollitia incidunt tenetur cumque ad eius delectus dolores consequatur. Quibusdam necessitatibus optio commodi omnis laudantium excepturi tempora blanditiis unde perferendis modi, veritatis quia dolore dolor quaerat corrupti porro. Corrupti iure labore animi rerum a placeat eveniet, velit ex consequatur, totam sequi similique quisquam laboriosam. Obcaecati deleniti facilis sequi amet, odit velit necessitatibus dolore dolorem impedit blanditiis, dolores sapiente saepe illo. Incidunt officiis optio quod excepturi eligendi quae error sed accusamus laudantium fuga repellat autem eum exercitationem, asperiores eos mollitia sunt corporis est quidem veniam. Fugit nihil velit esse commodi obcaecati aliquam eveniet voluptatibus nobis voluptatem illum quaerat, dicta, dolore at ipsa atque corrupti ex iste corporis accusantium rem, nesciunt officia sit laudantium hic! Obcaecati minus esse tenetur eius atque voluptas placeat molestias, magni perferendis ipsum, praesentium eum corrupti expedita a quod officiis quo dolores cupiditate minima culpa. Optio earum at odit, eveniet corporis tempore voluptatibus obcaecati praesentium perferendis repudiandae ipsum modi maxime expedita nesciunt ut maiores, odio neque exercitationem libero veritatis vitae harum consequuntur enim? Explicabo ut, magnam quibusdam hic, non odio aspernatur molestias, ea expedita consequatur impedit odit. Ratione delectus incidunt consequatur odio voluptatem, ut nihil quidem.
        </LayoutComponent.LeftSidebar>
        <LayoutComponent.RightSidebar>
          <h2>Right Sidebar Content</h2>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe blanditiis deserunt veritatis laboriosam quod accusamus quasi consectetur quam voluptate ad ea aperiam beatae necessitatibus, ut reprehenderit expedita vero illo hic ratione enim quaerat possimus laborum delectus! Officiis at molestias blanditiis perspiciatis temporibus deserunt dolorum qui fugiat dolore architecto dolores enim soluta facilis optio, molestiae modi libero nesciunt tempore hic veniam! Soluta dolor explicabo nulla sequi itaque voluptate aspernatur velit odio at, voluptates quas totam, repellendus minima vel tempora nesciunt! Error id amet molestias accusantium, tempore assumenda, recusandae veritatis veniam eligendi hic quo nobis placeat laboriosam modi commodi pariatur fuga ipsa minus non voluptatem quibusdam ex nulla. Sint eligendi reprehenderit animi ullam, modi laborum, eveniet fugiat nihil sit repudiandae soluta provident voluptate odit? Debitis cumque impedit consectetur nam quae ad non est reiciendis! Velit necessitatibus minus fugit, pariatur facere dolor perferendis expedita dolores esse cumque nihil? Unde architecto in magni praesentium atque, at repellendus. Perferendis mollitia harum fugit deserunt totam tempora inventore laudantium ducimus odit, voluptate quam assumenda ipsa doloremque quisquam excepturi hic corporis natus rerum qui blanditiis officiis possimus sed porro vel? Voluptates error rem exercitationem magni id, nihil eveniet ipsum inventore veniam laborum consequatur unde officia aliquam commodi facilis praesentium itaque. Voluptate, magni asperiores consequuntur omnis tempora accusamus deleniti rerum commodi repudiandae quod ipsam doloremque libero nihil totam ab quae laborum et. Fugit sequi nesciunt ratione eius quasi, nulla reprehenderit aliquam. Necessitatibus beatae possimus illum saepe minus! Quam facilis, laboriosam nesciunt ducimus eligendi atque natus quasi enim repellendus officia aliquam id repudiandae placeat culpa voluptates tenetur modi necessitatibus vitae eius. Dicta, laboriosam quae. Quisquam ab adipisci magni ducimus repudiandae quaerat praesentium ad aspernatur, ipsam hic. Distinctio libero eligendi pariatur dolore quidem expedita, sequi, ratione voluptate ex quam earum commodi, vero voluptatibus! Quae nisi, architecto libero tempore quo, soluta labore provident sed at corrupti obcaecati rerum, autem dolorum earum atque nemo mollitia incidunt tenetur cumque ad eius delectus dolores consequatur. Quibusdam necessitatibus optio commodi omnis laudantium excepturi tempora blanditiis unde perferendis modi, veritatis quia dolore dolor quaerat corrupti porro. Corrupti iure labore animi rerum a placeat eveniet, velit ex consequatur, totam sequi similique quisquam laboriosam. Obcaecati deleniti facilis sequi amet, odit velit necessitatibus dolore dolorem impedit blanditiis, dolores sapiente saepe illo. Incidunt officiis optio quod excepturi eligendi quae error sed accusamus laudantium fuga repellat autem eum exercitationem, asperiores eos mollitia sunt corporis est quidem veniam. Fugit nihil velit esse commodi obcaecati aliquam eveniet voluptatibus nobis voluptatem illum quaerat, dicta, dolore at ipsa atque corrupti ex iste corporis accusantium rem, nesciunt officia sit laudantium hic! Obcaecati minus esse tenetur eius atque voluptas placeat molestias, magni perferendis ipsum, praesentium eum corrupti expedita a quod officiis quo dolores cupiditate minima culpa. Optio earum at odit, eveniet corporis tempore voluptatibus obcaecati praesentium perferendis repudiandae ipsum modi maxime expedita nesciunt ut maiores, odio neque exercitationem libero veritatis vitae harum consequuntur enim? Explicabo ut, magnam quibusdam hic, non odio aspernatur molestias, ea expedita consequatur impedit odit. Ratione delectus incidunt consequatur odio voluptatem, ut nihil quidem.
        </LayoutComponent.RightSidebar>
        <LayoutComponent.Main>
          <div>
            <div
              id="editor"
              contentEditable="true"
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: content }}
              style={{
                width: '100%',
                height: '200px',
                border: '1px solid #ccc',
                padding: '10px',
                outline: 'none'
              }}
            ></div>
          </div>
        </LayoutComponent.Main>
        <LayoutComponent.Footer>
          <h1>Footer Content</h1>
        </LayoutComponent.Footer>
      </LayoutComponent>
    </div>
  );
}

export default EditorLayout;
